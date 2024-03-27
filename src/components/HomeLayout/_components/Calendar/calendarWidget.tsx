import { Card, Timeline } from 'antd'
import 'dayjs/locale/fr'

import './CalendarWidget-styles.less'

export const CalendarWidget: React.FC = () => {
	const appointments = [
		{ title: 'Rencontre avec plein d étudiants.', time: 10 },
		{ title: 'Salon avec des entrepreneurs et des patrons.', time: 14 },
		{ title: 'Salon avec des entrepreneurs et des patrons.', time: 15 },
	]

	const items = appointments.map((appointment) => ({
		label: <div className="timeline-item">{`${appointment.time}:00`}</div>,
		children: <div className="timeline-item appointment-title">{appointment.title}</div>,
	}))

	return (
		<Card title="Journée" size="small" bordered={false} className="calendar-widget">
			<Timeline mode="left" items={items} />
		</Card>
	)
}
