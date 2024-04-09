import { useQuery } from '@tanstack/react-query'
import { Card, Col, List, Row, Typography } from 'antd'

import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import '../../HomeLayout-styles.less'

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
						renderItem={(item) => (
							<div
								style={{
									border: '1px solid #ccc',
									borderRadius: '5px',
									padding: '10px',
									marginBottom: '10px',
								}}
							>
								<Row>
									<Col span={8}>
										<Typography.Text>{item.school_name}</Typography.Text>
										<Typography.Text>{item.school_city}</Typography.Text>
									</Col>
									<Col span={8} offset={8}>
										<Typography.Text>{item.contacted_date}</Typography.Text>
										<Typography.Text>{item.planned_date}</Typography.Text>
									</Col>
								</Row>
							</div>
						)}
					/>
				</Col>

				<Col xs={24} sm={8}>
					<Typography.Title level={5}>Contacté</Typography.Title>
					<List
						dataSource={contactedAppointments}
						renderItem={(item) => (
							<div
								style={{
									border: '1px solid #ccc',
									borderRadius: '5px',
									padding: '10px',
									marginBottom: '10px',
								}}
							>
								<Row>
									<Col span={8}>
										<Typography.Text>{item.school_name}</Typography.Text>
										<Typography.Text>{item.school_city}</Typography.Text>
									</Col>
									<Col span={8} offset={8}>
										<Typography.Text>{item.contacted_date}</Typography.Text>
									</Col>
								</Row>
							</div>
						)}
					/>
				</Col>

				<Col xs={24} sm={8}>
					<Typography.Title level={5}>Rendez-vous planifié</Typography.Title>
					<List
						dataSource={plannedAppointments}
						renderItem={(item) => (
							<div
								style={{
									border: '1px solid #ccc',
									borderRadius: '5px',
									padding: '10px',
									marginBottom: '10px',
								}}
							>
								<Row>
									<Col span={8}>
										<Typography.Text>{item.school_name}</Typography.Text>
										<Typography.Text>{item.school_city}</Typography.Text>
									</Col>
									<Col span={8} offset={8}>
										<Typography.Text>{item.planned_date}</Typography.Text>
									</Col>
								</Row>
							</div>
						)}
					/>
				</Col>
			</Row>
		</Card>
	)
}
