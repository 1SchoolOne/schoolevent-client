import { Form as AntdForm, Skeleton } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'

import { LoadingError } from '@components'
import { useAppointmentForm } from '@contexts'

import { Modal } from '../../../Modal/Modal'
import { Attachments } from '../Attachments/Attachments'
import { CommentList } from '../CommentList/CommentList'
import { Form } from '../Form/Form'

dayjs.extend(utc)
dayjs.extend(timezone)

export function ViewModal() {
	const { initialValues, hasLoaded, isLoading, error } = useAppointmentForm()
	const [formInstance] = AntdForm.useForm()

	const formKey = useMemo(() => {
		return hasLoaded ? 'view-apt-form' : 'view-apt-form-loading'
	}, [hasLoaded])

	return (
		<Modal
			className="appointment-modal appointment-modal--view"
			title={hasLoaded ? initialValues?.school_name : error ? 'Erreur' : <Skeleton.Input active />}
			footer={(_, { CancelBtn }) => <CancelBtn />}
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
						initialValues={{
							...initialValues,
							contacted_date: initialValues?.contacted_date
								? dayjs(initialValues.contacted_date)
								: undefined,
							planned_date: initialValues?.planned_date
								? dayjs(initialValues.planned_date)
								: undefined,
						}}
						mode="view"
					/>
					<Attachments />
					<CommentList />
				</>
			)}
		</Modal>
	)
}
