import { Badge, Card, Col, List, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { ICalendarProps } from '../Home-types'

import '../../HomeLayout-styles.less'

export function AppointmentsWidget({ appointments }: ICalendarProps) {
	const toContactAppointments = appointments
		?.filter((appointment) => appointment.apt_status === 'to_contact')
		.slice(0, 3)
	const contactedAppointments = appointments
		?.filter((appointment) => appointment.apt_status === 'contacted')
		.slice(0, 2)
	const plannedAppointments = appointments
		?.filter((appointment) => appointment.apt_status === 'planned')
		.slice(0, 2)

	return (
		<Card title="Rendez-vous" size="small" bordered={false} className="global-medium-widget">
			<Row gutter={[16, 16]}>
				<Col xs={24} sm={8}>
					<Typography.Title
						level={5}
					>{`À contacter (${toContactAppointments?.length})`}</Typography.Title>
					<List
						dataSource={toContactAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title={item.school_name}
									description={<Badge status="processing" text="À contacter" />}
								/>
							</List.Item>
						)}
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Typography.Title
						level={5}
					>{`Contacté (${contactedAppointments?.length})`}</Typography.Title>
					<List
						dataSource={contactedAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title={item.school_name}
									description={
										<>
											<Badge status="success" text="Contacté" />
											<br />
											<Typography.Text>
												{'Contacté le : ' + dayjs(item.contacted_date).format('DD/MM/YYYY - HH:mm')}
											</Typography.Text>
										</>
									}
								/>
							</List.Item>
						)}
					/>
				</Col>
				<Col xs={24} sm={8}>
					<Typography.Title
						level={5}
					>{`Rendez-vous planifié (${plannedAppointments?.length})`}</Typography.Title>
					<List
						dataSource={plannedAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<List.Item.Meta
									className="favorites-list__item"
									title={item.school_name}
									description={
										<>
											<Badge status="warning" text="Planifié" />
											<br />
											<Typography.Text>
												{'Planifié le : ' + dayjs(item.planned_date).format('DD/MM/YYYY - HH:mm')}
											</Typography.Text>
										</>
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
