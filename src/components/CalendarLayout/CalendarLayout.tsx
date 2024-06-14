import { useQuery } from '@tanstack/react-query'

import { BasicLayout } from '@components'
import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import { Calendar, CalendarList } from './_components'

import './CalendarLayout-styles.less'

export function CalendarLayout() {
	const supabase = useSupabase()
	const { user } = useAuth()

	const { data: events } = useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const { data, error } = await supabase.from('events').select('*')

			if (error) {
				log.error('Error fetching events', error)
				throw error
			}

			return data
		},
	})

	const { data: appointments } = useQuery({
		queryKey: ['appointments'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('appointments')
				.select('*')
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				log.error('Error fetching appointments', error)
				throw error
			}

			return data?.filter((appointment) => appointment.apt_status === 'planned')
		},
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
