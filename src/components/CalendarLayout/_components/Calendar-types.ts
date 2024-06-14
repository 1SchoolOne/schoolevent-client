import { Database, TAppointment, TEvent } from '@types'

export interface ICalendarProps {
	appointments: TAppointment[]
	events: TEvent[]
}

export interface ICalendarListProps extends ICalendarProps {}

export type AppointmentItem = Database['public']['Tables']['appointments']['Row']

export type EventItem = Database['public']['Tables']['events']['Row']
