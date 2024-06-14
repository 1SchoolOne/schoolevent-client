import { Database, TAppointment, TEvent } from '@types'

export interface ICalendarProps {
	appointments: Array<TAppointment & { users: { email: string } | null }>
	events: Array<TEvent & { users: { email: string } | null }>
}

export interface ICalendarListProps extends ICalendarProps {}

export type AppointmentItem = Database['public']['Tables']['appointments']['Row'] & {
	users: { email: string } | null
}

export type EventItem = Database['public']['Tables']['events']['Row'] & {
	users: { email: string } | null
}
