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
