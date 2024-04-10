import { Card, List, Flex, Badge } from 'antd'
import { TEvent, TAppointment } from './CalendarWidget-types'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import '../../HomeLayout-styles.less'

interface CalendarWidgetProps {
	events: TEvent[];
	appointments: TAppointment[];
}

export function CalendarWidget({ events, appointments }: CalendarWidgetProps) {

	const currentDate = dayjs()
	const plannedAppointments = appointments?.filter((appointment) => appointment.apt_status === 'planned')

	const todaysEvents = events
		? events
			.filter((event) => dayjs(event.event_date).isSame(currentDate, 'day'))
			.sort((a, b) => dayjs(a.event_date).hour() - dayjs(b.event_date).hour())
		: []

	const todaysAppointments = plannedAppointments
		? plannedAppointments
			.filter((appointment) => dayjs(appointment.planned_date).isSame(currentDate, 'day'))
			.sort((a, b) => dayjs(a.planned_date).hour() - dayjs(b.planned_date).hour())
		: []

	const combinedEventsAndAppointments = [...todaysEvents, ...todaysAppointments]
	const sortedEventsAndAppointments = combinedEventsAndAppointments.sort((a, b) => {
		const aDate = 'event_date' in a ? a.event_date : a.planned_date
		const bDate = 'event_date' in b ? b.event_date : b.planned_date

		return dayjs(aDate).hour() - dayjs(bDate).hour()
	})

	return (
		<Card   title={
			<>
				Vos <Badge color="orange" /> rendez-vous et
				<Badge color="blue" style={{ marginLeft: '5px' }} /> événements du jour
			</>
		}  size="small" bordered={false} className="global-little-widget">
			<List
				dataSource={sortedEventsAndAppointments}
				renderItem={(item) => (
					<List.Item key={'event_title' in item ? item.event_title : item.school_name}>
						<List.Item.Meta
							className="favorites-list__item"
							title={
								<>
									{'event_title' in item ? <Badge color="blue" /> : <Badge color="orange" />}
									<span style={{ marginLeft: '5px' }}>
          {'event_title' in item ? item.event_title : item.school_name}
         </span>
								</>
							}
							description={
								<Flex justify="space-between">
									<i>
										{'event_date' in item ? dayjs(item.event_date).format('HH:mm') : dayjs(item.planned_date).format('HH:mm')}
									</i>
								</Flex>
							}
						/>
					</List.Item>
				)}
			/>
		</Card>
	)
}
