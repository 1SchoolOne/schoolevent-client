import { useQuery } from '@tanstack/react-query'
import { Card, Col, List, Row, Typography } from 'antd'

import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { TAppointment } from '../../../../types/appointments'

import '../../HomeLayout-styles.less'

function AppointmentItem({ appointment }: Readonly<{ appointment: TAppointment }>) {
	return (
		<List.Item>
			<div>
				<h4>{appointment.school_name}</h4>
				<h4>{appointment.school_city}</h4>
				<p>{appointment.contacted_date}</p>
				<p>{appointment.planned_date}</p>
			</div>
		</List.Item>
	)
}

export function AppointmentsWidget() {
	const supabase = useSupabase()
	const { user } = useAuth()

	const { data } = useQuery({
		queryKey: ['appointments'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('appointments')
				.select('*')
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				console.error('Error fetching appointments', error)
				throw error
			}

			return data
		},
	})

	const toContactAppointments = data?.filter(
		(appointment) => appointment.apt_status === 'to_contact',
	)
	const contactedAppointments = data?.filter(
		(appointment) => appointment.apt_status === 'contacted',
	)
	const plannedAppointments = data?.filter((appointment) => appointment.apt_status === 'planned')

	return (
		<Card title="Rendez-vous" size="small" bordered={false} className="global-middle-widget">
			<Row gutter={16}>
				<Col xs={24} sm={8}>
					<Typography.Title level={5}>À contacter</Typography.Title>
					<List
						dataSource={toContactAppointments}
						renderItem={(item) => <AppointmentItem appointment={item} />}
					/>
				</Col>
				<Col xs={24} sm={8} className="category-container">
					<Typography.Title level={5}>Contacté</Typography.Title>
					<List
						dataSource={contactedAppointments}
						renderItem={(item) => <AppointmentItem appointment={item} />}
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Typography.Title level={5}>Rendez-vous planifié</Typography.Title>
					<List
						dataSource={plannedAppointments}
						renderItem={(item) => <AppointmentItem appointment={item} />}
					/>
				</Col>
			</Row>
		</Card>
	)
}
