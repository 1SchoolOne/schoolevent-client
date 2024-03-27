import { Card, Col, List, Row, Typography } from 'antd'

import './AppointmentWidget-styles.less'

export const AppointmentsWidget: React.FC<{ appointments: any[] }> = ({ appointments }) => {
	const toContactAppointments = appointments.filter(
		(appointment) => appointment.status === 'to_contact',
	)
	const contactedAppointments = appointments.filter(
		(appointment) => appointment.status === 'contacted',
	)
	const plannedAppointments = appointments.filter((appointment) => appointment.status === 'planned')

	return (
		<Card title="Rendez-vous" size="small" bordered={true} className="appointment-widget">
			<Row>
				<Col span={8}>
					<Typography.Title level={5}>À contacter</Typography.Title>
					<List
						dataSource={toContactAppointments}
						renderItem={(item) => <List.Item>{item.name}</List.Item>}
					/>
				</Col>
				<Col span={8} className="category-container">
					<Typography.Title level={5}>Contacté</Typography.Title>
					<List
						dataSource={contactedAppointments}
						renderItem={(item) => <List.Item>{item.name}</List.Item>}
					/>
				</Col>
				<Col span={8}>
					<Typography.Title level={5}>Rendez-vous planifié</Typography.Title>
					<List
						dataSource={plannedAppointments}
						renderItem={(item) => <List.Item>{item.name}</List.Item>}
					/>
				</Col>
			</Row>
		</Card>
	)
}
