import { useQuery } from '@tanstack/react-query'
import { Col, Row } from 'antd'

import { BasicLayout } from '@components'
import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import { AppointmentsWidget } from './_components/Appointment/appointmentWidget'
import { CalendarWidget } from './_components/Calendar/calendarWidget'
import { NextEventWidget } from './_components/Event/NextEventWidget'
import { VisitsWidget } from './_components/Event/VisitsWidget'
import { FavoritesWidget } from './_components/Favorites/favoritesWidget'
import { StudentWidget } from './_components/Student/studentWidget'

import './HomeLayout-styles.less'

export function HomeLayout() {
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

			return data
		},
	})

	const widgets = [
		{
			component: <NextEventWidget events={events ?? []} appointments={appointments ?? []} />,
			xs: 24,
			md: 24,
		},
		{ component: <AppointmentsWidget appointments={appointments ?? []} />, xs: 24, md: 18 },
		{
			component: <CalendarWidget events={events ?? []} appointments={appointments ?? []} />,
			xs: 24,
			md: 6,
		},
		{ component: <VisitsWidget />, xs: 24, sm: 12, md: 6 },
		{ component: <StudentWidget />, xs: 24, sm: 12, md: 6 },
		{ component: <FavoritesWidget />, xs: 24, sm: 24, md: 12 },
	]

	return (
		<BasicLayout className="home-layout" contentClassName="ant-layout-content">
			<Row gutter={[16, 16]}>
				{widgets.map((widget, index) => (
					<Col key={index} xs={widget.xs} sm={widget.sm} md={widget.md}>
						{widget.component}
					</Col>
				))}
			</Row>
		</BasicLayout>
	)
}
