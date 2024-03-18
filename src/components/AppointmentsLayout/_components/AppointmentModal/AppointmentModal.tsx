import { useAppointmentForm } from '@contexts'

import { EditModal, NewModal, ViewModal } from './_components'

import './AppointmentModal-styles.less'

export function AppointmentModal() {
	const { mode } = useAppointmentForm()

	if (mode === 'view') {
		return <ViewModal />
	} else if (mode === 'edit') {
		return <EditModal />
	}

	return <NewModal />
}
