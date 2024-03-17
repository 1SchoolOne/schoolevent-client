import { Check as SaveIcon } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form as AntdForm, App, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoadingError } from '@components'
import { useAppointmentForm, useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { Modal } from '../../../Modal/Modal'
import { Attachments } from '../Attachments/Attachments'
import { CommentList } from '../CommentList/CommentList'
import { Form } from '../Form/Form'
import { IFormValues } from '../Form/Form-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function EditModal() {
	const [formInstance] = AntdForm.useForm()
	const { user } = useAuth()
	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { notification } = App.useApp()
	const { appointmentId, isLoading, hasLoaded, initialValues, error } = useAppointmentForm()

	// Update appointment
	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IFormValues) => {
			if (!appointmentId) {
				throw new Error('appointmentId is required')
			}

			const { data, error } = await supabase
				.from('appointments')
				.update({
					...values,
					contacted_date: values.contacted_date?.toISOString() ?? null,
					planned_date: values.planned_date?.toISOString() ?? null,
				})
				.eq('id', appointmentId)
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				throw error
			}

			return data
		},
		onError: (error) => {
			notification.error({ message: error.message, duration: 5 })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['appointment', { appointmentId }],
			})
			queryClient.invalidateQueries({
				queryKey: ['appointments'],
			})
			notification.success({ message: 'Rendez-vous modifié avec succès', duration: 5 })
			navigate('/appointments')
		},
	})

	const formKey = useMemo(() => {
		return hasLoaded ? 'new-apt-form' : 'new-apt-form-loading'
	}, [hasLoaded])

	return (
		<Modal
			className="appointment-modal appointment-modal--edit"
			title={hasLoaded ? initialValues?.school_name : error ? 'Erreur' : <Skeleton.Input active />}
			footer={(_, { CancelBtn, OkBtn }) => (
				<>
					<CancelBtn />
					{!error && <OkBtn />}
				</>
			)}
			cancelText="Annuler"
			okText="Enregistrer"
			okButtonProps={{
				htmlType: 'submit',
				type: 'primary',
				icon: <SaveIcon size={16} weight="bold" />,
				disabled: isLoading,
				loading: isPending,
			}}
			onOk={() => {
				formInstance.submit()
			}}
			closable={false}
			destroyOnClose
		>
			{error ? (
				<LoadingError error={error} />
			) : (
				<>
					<Form
						key={formKey}
						formInstance={formInstance}
						isLoading={isLoading}
						isPending={isPending}
						onFinish={mutate}
						initialValues={{
							...initialValues,
							contacted_date: initialValues?.contacted_date
								? dayjs(initialValues.contacted_date)
								: undefined,
							planned_date: initialValues?.planned_date
								? dayjs(initialValues.planned_date)
								: undefined,
						}}
						mode="edit"
					/>
					<Attachments />
					<CommentList />
				</>
			)}
		</Modal>
	)
}
