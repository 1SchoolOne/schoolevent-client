import { Dispatch, SetStateAction } from 'react'

import { TContact } from '@types'

import { ISchool } from '../../components/ContactsLayout/_components/ContactsTable/ContactsTable-types'

export interface IGovContactsContext {
	dataMode: 'gov-contacts'
	setDataMode: Dispatch<SetStateAction<TDataMode>>
	setContacts: Dispatch<SetStateAction<Array<ISchool> | Array<TContact>>>
	contacts: Array<ISchool>
	myContacts?: never
}

export interface IMyContactsContext {
	dataMode: 'my-contacts'
	setDataMode: Dispatch<SetStateAction<TDataMode>>
	setContacts: Dispatch<SetStateAction<Array<ISchool> | Array<TContact>>>
	contacts?: never
	myContacts: Array<TContact>
}

export type TContactsContext = IGovContactsContext | IMyContactsContext

export type TDataMode = 'my-contacts' | 'gov-contacts'
