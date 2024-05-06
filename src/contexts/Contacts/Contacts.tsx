import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { PropsWithChildren, TContact } from '@types'

import { ISchool } from '../../components/ContactsLayout/_components/ContactsTable/ContactsTable-types'
import { TContactsContext, TDataMode } from './Contacts-types'

const ContactsContext = createContext<TContactsContext>({} as TContactsContext)

export function ContactsProvider({ children }: PropsWithChildren) {
	const [dataMode, setDataMode] = useState<TDataMode>('my-contacts')
	const [contacts, setContacts] = useState<Array<ISchool> | Array<TContact>>([])
	const queryClient = useQueryClient()

	useEffect(
		function refetchContactsOnModeChange() {
			queryClient.invalidateQueries({ queryKey: [dataMode] }).then(async () => {
				await queryClient.refetchQueries({ queryKey: [dataMode] })
			})
		},
		[dataMode, queryClient],
	)

	const value: TContactsContext = useMemo(() => {
		if (dataMode === 'my-contacts') {
			return {
				dataMode: 'my-contacts',
				setDataMode,
				setContacts,
				myContacts: contacts as unknown as Array<TContact>,
			}
		}
		return {
			dataMode,
			setDataMode,
			setContacts,
			contacts: contacts as unknown as Array<ISchool>,
		}
	}, [dataMode, contacts])

	return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>
}

export function useContacts() {
	return useContext(ContactsContext)
}
