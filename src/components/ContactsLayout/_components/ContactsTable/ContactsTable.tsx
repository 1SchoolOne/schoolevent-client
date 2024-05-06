import { useContacts } from '@contexts'

import { GovContacts } from '../GovContacts/GovContacts'
import { MyContacts } from '../MyContacts/MyContacts'

// TODO: re-implement range filter
export function ContactsTable() {
	const { dataMode } = useContacts()

	return dataMode === 'my-contacts' ? <MyContacts /> : <GovContacts />
}
