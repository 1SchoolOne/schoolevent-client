import { TeamOutlined } from '@ant-design/icons'
import {Card, Col, Row, Statistic, Typography, Button, Space} from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../HomeLayout-styles.less'

import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import {TAppointment, TEvent} from "./EventWidget-types";


interface EventWidgetProps {
	events: TEvent[];
	appointments: TAppointment[];
}

export function NextEventWidget({ events, appointments }: EventWidgetProps) {
	const navigate = useNavigate()
	const currentDate = dayjs()
	const plannedAppointments = appointments?.filter((appointment) => appointment.apt_status === 'planned')
	const studentCount = useMemo(() => 3, [])


	const nextEvent = events
		? events
			.filter((event) => dayjs(event.event_date).isAfter(currentDate))
			.sort((a, b) => dayjs(a.event_date).isAfter(dayjs(b.event_date)) ? 1 : -1)
			[0]
		: null;

	const nextAppointment = plannedAppointments
		? plannedAppointments
			.filter((appointment) => dayjs(appointment.planned_date).isAfter(currentDate))
			.sort((a, b) => dayjs(a.planned_date).isAfter(dayjs(b.planned_date)) ? 1 : -1)
			[0]
		: null;

	return (
		<Card
			title={
				<Space align="center">
					Bonjour Mathieu
					<Button type="primary" size="small" onClick={() => navigate(`/appointments?action=new`)}>
						Créer un rendez-vous
					</Button>
					<Button type="primary" size="small" onClick={() => navigate(`/events/new`)}>
						Créer un évenement
					</Button>
				</Space>
			}
			className={'global-large-widget'}
		>
			<Row gutter={16}>

				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Typography className="ant-statistic-title">Votre prochain événement est :</Typography>
					{nextEvent && (
						<Typography.Text>
							{"Titre de l'événement : " + nextEvent.event_title}
							<br />
							{"Date de l'événement : " + dayjs(nextEvent.event_date).format('DD/MM/YYYY - HH:mm')}
						</Typography.Text>
					)}
				</Col>

				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Statistic
						title="Nombre d'étudiants présents a l'événement :"
						value={studentCount}
						prefix={<TeamOutlined />}
					/>
				</Col>

				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Typography className="ant-statistic-title">Votre prochain rendez-vous est :</Typography>
					{nextAppointment && (
						<Typography.Text>
							{"Nom de l'école : " + nextAppointment.school_name}
							<br />
							{"Date du rendez-vous : " + dayjs(nextAppointment.planned_date).format('DD/MM/YYYY - HH:mm')}
						</Typography.Text>
					)}
				</Col>
			</Row>
		</Card>
	)
}
