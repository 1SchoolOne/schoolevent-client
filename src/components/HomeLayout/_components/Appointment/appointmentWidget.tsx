import { Card, Col, List, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import '../../HomeLayout-styles.less'
import {TAppointment} from "./AppointmentWidget-types"

interface AppointmentsWidgetProps {
	appointments: TAppointment[];
}

export function AppointmentsWidget({ appointments }: AppointmentsWidgetProps) {

	const toContactAppointments = appointments?.filter(
		(appointment) => appointment.apt_status === 'to_contact',
	).slice(0, 6)
	const contactedAppointments = appointments?.filter(
		(appointment) => appointment.apt_status === 'contacted',
	).slice(0, 3)
	const plannedAppointments = appointments?.filter((appointment) => appointment.apt_status === 'planned').slice(0, 3)

	return (
		<Card title="Rendez-vous" size="small" bordered={false} className="global-medium-widget">
			<Row gutter={16}>
				<Col xs={24} sm={8}>
					<Typography.Title level={5}>{`À contacter (${toContactAppointments?.length})`}</Typography.Title>
					<List
						dataSource={toContactAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title= {item.school_name}
								/>
							</List.Item>
						)}
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Typography.Title level={5}>{`Contacté (${contactedAppointments?.length})`}</Typography.Title>
					<List
						dataSource={contactedAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title= {item.school_name}
									description={
										<Typography.Text>
											{"Contacté le : "  + dayjs(item.contacted_date).format('DD/MM/YYYY - HH:mm')}
										</Typography.Text>
									}
								/>
							</List.Item>
						)}
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Typography.Title level={5}>{`Rendez-vous planifié (${plannedAppointments?.length})`}</Typography.Title>
					<List
						dataSource={plannedAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title= {item.school_name}
									description={
										<Typography.Text>
											{"Planifié le : "  + dayjs(item.planned_date).format('DD/MM/YYYY - HH:mm')}
										</Typography.Text>
									}
								/>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</Card>
	)
}