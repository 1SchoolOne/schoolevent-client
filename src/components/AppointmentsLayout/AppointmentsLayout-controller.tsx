import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AppointmentFormProvider } from '../../contexts/AppointmentForm/AppointmentForm'
import { getIsActionValid, getIsStatusValid } from './AppointmentsLayout-utils'
import { AppointmentModal } from './_components'

export function useController() {
	const [searchParams, setSearchParams] = useSearchParams()

	// Check if action type is valid
	const action = searchParams.get('action')
	const isActionValid = getIsActionValid(action)

	// Check if the id is valid
	const id = searchParams.get('id')
	const isIdValid = !!(id && !Number.isNaN(Number(id)))

	// Get the school id
	const school_id = searchParams.get('school_id')

	// Get the status of the appointment
	const status = searchParams.get('status')
	const isStatusValid = getIsStatusValid(status)

	useEffect(() => {
		// Flag to check if the search params should be updated
		let shouldUpdate = false
		let skipRest = false

		// Deletes the action from the url if it's not valid
		if (action && !isActionValid) {
			searchParams.forEach((_, key) => searchParams.delete(key))
			shouldUpdate = true
			skipRest = true
		}

		// Deletes the id from the url if it's not valid
		if (!skipRest && id && !isIdValid) {
			searchParams.delete('id')
			shouldUpdate = true
		}

		// Update the search params if needed
		if (shouldUpdate) {
			setSearchParams(searchParams)
		}
	}, [id, isIdValid, action, isActionValid, searchParams, setSearchParams])

	const renderModal = () => {
		if (!isActionValid || (action !== 'new' && !isIdValid)) {
			return null
		}

		if (action === 'view') {
			return (
				<AppointmentFormProvider appointmentId={id!} mode={action}>
					<AppointmentModal appointmentId={id} mode={action} />
				</AppointmentFormProvider>
			)
		} else if (action === 'new') {
			return (
				<AppointmentFormProvider
					mode="new"
					schoolId={school_id ?? undefined}
					status={isStatusValid ? status : null}
				>
					<AppointmentModal
						schoolId={school_id}
						status={isStatusValid ? status : null}
						mode={action}
					/>
				</AppointmentFormProvider>
			)
		} else {
			return (
				<AppointmentFormProvider appointmentId={id!} mode={action}>
					<AppointmentModal appointmentId={id} mode={action} />
				</AppointmentFormProvider>
			)
		}
	}

	return { renderModal }
}
