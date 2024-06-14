import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

import { BasicLayout } from '@components'
import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import { Calendar, CalendarList } from './_components'
import { AppointmentItem, EventItem } from './_components/Calendar-types'

import './CalendarLayout-styles.less'

export function CalendarLayout() {
	const supabase = useSupabase()
	const [searchValue] = useState('')
	const { user } = useAuth()

	function filterAndSortData<T extends AppointmentItem | EventItem>(
		data: T[],
		dateKey: keyof T,
		searchKey: keyof T,
		searchValue: string,
	): T[] {
		return data
			.filter(
				(item: T) => item[searchKey] !== null && item[searchKey]?.toString().includes(searchValue),
			)
			.sort(
				(a: T, b: T) =>
					dayjs(a[dateKey] as string).valueOf() - dayjs(b[dateKey] as string).valueOf(),
			)
	}

	const { data: events } = useQuery({
		queryKey: ['events-calendar'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('events')
				.select('*, users!events_event_assignee_fkey(email)')
				.or(`event_assignee.eq.${user!.id},event_creator_id.eq.${user!.id}`)

			if (error) {
				log.error('Error fetching events', error)
				throw error
			}

			return data
		},
		select: (data) => filterAndSortData<EventItem>(data, 'event_date', 'event_title', searchValue),
	})

	const { data: appointments } = useQuery({
		queryKey: ['appointments-calendar'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('appointments')
				.select('*, users!appointments_assignee_fkey(email)')
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				log.error('Error fetching appointments', error)
				throw error
			}

			return data?.filter((appointment) => appointment.apt_status === 'planned')
		},
		select: (data) =>
			filterAndSortData<AppointmentItem>(data, 'planned_date', 'school_name', searchValue),
	})

	return (
		<BasicLayout
			className="calendar-layout"
			contentClassName="calendar-layout__content"
			sider={<CalendarList events={events ?? []} appointments={appointments ?? []} />}
		>
			<Calendar events={events ?? []} appointments={appointments ?? []} />
		</BasicLayout>
	)
}
