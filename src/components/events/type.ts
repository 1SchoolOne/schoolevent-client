import { TEventTypeValue } from './EventForm/EventForm-types'

export interface IEventFormFields {
	id: number
	event_date: string
	event_title: string
	event_address: string
	event_background?: string
	event_duration: number
	event_type: TEventTypeValue
	event_description: string
	event_creator_id: string
	event_school_name: string
}

export interface IUser {
	id: string
	email: string
	role: TUserTypeValue
}

export type TUserTypeLabel = 'Manager' | 'Administrateur' | 'Étudiant'
export type TUserTypeValue = 'manager' | 'admin' | 'student'

export const eventTypesRecord: Record<TUserTypeValue, TUserTypeLabel> = {
	manager: 'Manager',
	admin: 'Administrateur',
	student: 'Étudiant',
}
