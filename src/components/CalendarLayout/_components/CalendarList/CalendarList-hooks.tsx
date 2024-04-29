import {
	PencilSimple as PencilSimpleIcon,
} from '@phosphor-icons/react'

import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useState, useCallback } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ICalendarListProps } from './CalendarList-types'

export function useCalendarList(props: ICalendarListProps) {
	const { events, appointments } = props
	const [search, setSearch] = useState('')
	const [selectedButton, setSelectedButton] = useState('Rendez-vous')
	const navigate = useNavigate()
	const currentDate = dayjs()

	const sortedAndFilteredEvents = events
		.filter(
			(event) => dayjs(event.event_date).isAfter(currentDate) && event.event_title.includes(search),
		)
		.sort((a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf())

	const sortedAndFilteredAppointments = appointments
		.filter(
			(appointment) =>
				dayjs(appointment.planned_date).isAfter(currentDate) &&
				appointment.school_name.includes(search),
		)
		.sort((a, b) => dayjs(a.planned_date).valueOf() - dayjs(b.planned_date).valueOf())

	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}, [])

	const handleSegmentChange = useCallback((value: string | number) => {
		if (typeof value === 'string') {
			setSelectedButton(value)
		}
	}, [])

	const getAppointmentsMenu = useCallback((id: number): ItemType[] => [
		{
			key: 'create-follow-up',
			label: 'Modifier le rendez-vous',
			icon: <PencilSimpleIcon size={16} weight="bold" />,
			onClick: () => navigate(`/appointments?action=edit&id=${id}`),
		},
	], [navigate])

	const getEventsMenu = useCallback((_id: string): ItemType[] => [
		{
			key: 'create-follow-up',
			label: "Modifier l'événement",
			icon: <PencilSimpleIcon size={16} weight="bold" />,
			// onClick: () => navigate(`/appointments?action=edit&id=${id}`),
		},
	], [])

	return {
		search,
		selectedButton,
		sortedAndFilteredEvents,
		sortedAndFilteredAppointments,
		handleSearchChange,
		handleSegmentChange,
		getAppointmentsMenu,
		getEventsMenu
	}
}
