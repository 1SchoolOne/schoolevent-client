import { TAppointment, TEvent } from '@types'
import { useNavigate } from 'react-router-dom'

export interface ICalendarProps {
	appointments: TAppointment[]
	events: TEvent[]
}

export interface UseCalendarProps {
	appointments: TAppointment[]
	events: TEvent[]
	navigate: ReturnType<typeof useNavigate>
}
