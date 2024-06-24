import { TAppointment, TEvent } from '@types'

export interface ICalendarProps {
	appointments: Array<TAppointment & { users: { email: string } | null }>
	events: Array<TEvent & { users: { email: string } | null }>
}
