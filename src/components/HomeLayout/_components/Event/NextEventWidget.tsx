import { CalendarOutlined, ClockCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Statistic, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { log, useSupabase } from '@utils'
import { useNavigate } from 'react-router-dom'

import { ICalendarProps } from '../Home-types'

import '../../HomeLayout-styles.less'
import { useQuery } from '@tanstack/react-query'

export function NextEventWidget({ events, appointments }: ICalendarProps) {
	const navigate = useNavigate()
	const currentDate = dayjs()
	const supabase = useSupabase()
	const plannedAppointments = appointments?.filter(
		(appointment) => appointment.apt_status === 'planned',
	)

	const nextEvent = events
		? events
			.filter((event) => dayjs(event.event_date).isAfter(currentDate))
			.sort((a, b) => (dayjs(a.event_date).isAfter(dayjs(b.event_date)) ? 1 : -1))[0]
		: null

	const { data: eventStudentCount } = useQuery({
		queryKey: ['event-participants', { eventId: nextEvent?.id }],
		queryFn: async () => {
			const { count, error } = await supabase
				.from('events_participants')
				.select('*', { count: 'exact' })
				.eq('event_id', nextEvent!.id)

			if (error) {
				log.error('Error fetching events_participants', error)
				throw error
			}

			return count ?? 0
		},
		enabled: !!nextEvent,
	})

	const nextAppointment = plannedAppointments
		? plannedAppointments
			.filter((appointment) => dayjs(appointment.planned_date).isAfter(currentDate))
			.sort((a, b) => (dayjs(a.planned_date).isAfter(dayjs(b.planned_date)) ? 1 : -1))[0]
		: null


	return (
		<Card
			title={
				<Space align="center">
					Bonjour,
					<Button type="primary" size="small" onClick={() => navigate(`/appointments?action=new`)}>
						Créer un rendez-vous
					</Button>
					<Button type="primary" size="small" onClick={() => navigate(`/events/new`)}>
						Créer un événement
					</Button>
				</Space>
			}
			className="global-large-widget"
		>
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={12} md={8}>
					<Typography.Title level={5}>Votre prochain événement :</Typography.Title>
					{nextEvent ? (
						<Typography.Text>
							<CalendarOutlined /> {nextEvent.event_title}
							<br />
							<ClockCircleOutlined /> {dayjs(nextEvent.event_date).format('DD/MM/YYYY - HH:mm')}
						</Typography.Text>
					) : (
						<Typography.Text>Aucun événement à venir</Typography.Text>
					)}
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Typography.Title level={5}>Nombre d'étudiants présents à l'événement :</Typography.Title>
					<Statistic value={eventStudentCount} prefix={<TeamOutlined />} />
				</Col>
				<Col xs={24} sm={12} md={8}>
					<Typography.Title level={5}>Votre prochain rendez-vous :</Typography.Title>
					{nextAppointment ? (
						<Typography.Text>
							<CalendarOutlined /> {nextAppointment.school_name}
							<br />
							<ClockCircleOutlined />{' '}
							{dayjs(nextAppointment.planned_date).format('DD/MM/YYYY - HH:mm')}
						</Typography.Text>
					) : (
						<Typography.Text>Aucun rendez-vous à venir</Typography.Text>
					)}
				</Col>
			</Row>
		</Card>
	)
}
