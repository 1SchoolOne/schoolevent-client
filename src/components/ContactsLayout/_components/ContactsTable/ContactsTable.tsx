import { ErrorBoundary } from 'react-error-boundary'

import { useContacts } from '@contexts'

import { ErrorBoundaryHandler } from '../../../ErrorBoundaryHandler/ErrorBoundaryHandler'
import { GovContacts } from '../GovContacts/GovContacts'
import { MyContacts } from '../MyContacts/MyContacts'

export function ContactsTable() {
	const { dataMode } = useContacts()

	return (
		<ErrorBoundary FallbackComponent={ErrorBoundaryHandler}>
			{dataMode === 'my-contacts' ? <MyContacts /> : <GovContacts />}
		</ErrorBoundary>
	)
}
