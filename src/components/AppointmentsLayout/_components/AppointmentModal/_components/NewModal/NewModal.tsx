import { Plus as PlusIcon } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form as AntdForm, App } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppointmentForm, useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { Modal } from '../../../Modal/Modal'
import { Form } from '../Form/Form'
import { IFormValues } from '../Form/Form-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function NewModal() {
	const { initialValues, isLoading, hasLoaded, status } = useAppointmentForm()
	const [formInstance] = AntdForm.useForm()
	const { user } = useAuth()
	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const { notification } = App.useApp()

	// Create appointment
	const { mutate, isPending } = useMutation({
		mutationFn: async (values: IFormValues) => {
			const { data, error } = await supabase.from('appointments').insert({
				...values,
				author_id: user!.id,
				contacted_date: values.contacted_date?.toISOString(),
				planned_date: values.planned_date?.toISOString(),
			})

			if (error) {
				throw error
			}

			return data
		},
		onError: (error) => {
			notification.error({ message: error.message, duration: 5 })
		},
		onSuccess: async () => {
			await queryClient.resetQueries({
				queryKey: ['appointments'],
			})
			notification.success({ message: 'Rendez-vous créé avec succès', duration: 5 })
			navigate('/appointments')
		},
	})

	const formKey = useMemo(() => {
		return hasLoaded ? 'new-apt-form' : 'new-apt-form-loading'
	}, [hasLoaded])

	return (
		<Modal
			className="appointment-modal appointment-modal--new"
			title="Nouveau rendez-vous"
			okText="Créer le rendez-vous"
			okButtonProps={{
				htmlType: 'submit',
				type: 'primary',
				icon: <PlusIcon size={16} weight="bold" />,
				loading: isPending,
			}}
			onOk={() => {
				formInstance.submit()
			}}
			closable={false}
		>
			<Form
				key={formKey}
				formInstance={formInstance}
				isLoading={isLoading}
				isPending={isPending}
				onFinish={mutate}
				initialValues={{
					...initialValues,
					contacted_date: status === 'contacted' ? dayjs().tz() : undefined,
					planned_date: status === 'planned' ? dayjs().tz() : undefined,
				}}
				mode="new"
			/>
		</Modal>
	)
}
