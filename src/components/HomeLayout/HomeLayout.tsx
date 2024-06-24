import { useQuery } from '@tanstack/react-query'
import { Col, Row } from 'antd'

import { BasicLayout } from '@components'
import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import { AppointmentsWidget } from './_components/Appointment/appointmentWidget'
import { CalendarWidget } from './_components/Calendar/calendarWidget'
import { NextEventWidget } from './_components/Event/NextEventWidget'
import { FavoritesWidget } from './_components/Favorites/favoritesWidget'
import { ICalendarProps } from './_components/Home-types'
import { StudentWidget } from './_components/Student/studentWidget'

import './HomeLayout-styles.less'

export function HomeLayout() {
	const supabase = useSupabase()
	const { user } = useAuth()

	const { data: events } = useQuery({
		queryKey: ['events'],
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
	})

	const { data: appointments } = useQuery({
		queryKey: ['appointments'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('appointments')
				.select('*, users!appointments_assignee_fkey(email)')
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				log.error('Error fetching appointments', error)
				throw error
			}

			return data
		},
	})

	const calendarProps: ICalendarProps = {
		events: events ?? [],
		appointments: appointments ?? [],
	}

	return (
		<BasicLayout className="home-layout" contentClassName="ant-layout-content">
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<NextEventWidget {...calendarProps} />
				</Col>
			</Row>
			<Row gutter={[16, 16]}>
				<Col xs={24} md={18}>
					<AppointmentsWidget {...calendarProps} />
					<Row gutter={[16, 16]}>
						<Col xs={24} md={12} className="full-height">
							<FavoritesWidget />
						</Col>
						<Col xs={24} md={12} className="full-height">
							<StudentWidget />
						</Col>
					</Row>
				</Col>
				<Col xs={24} md={6} className="full-height">
					<CalendarWidget {...calendarProps} />
				</Col>
			</Row>
		</BasicLayout>
	)
}
