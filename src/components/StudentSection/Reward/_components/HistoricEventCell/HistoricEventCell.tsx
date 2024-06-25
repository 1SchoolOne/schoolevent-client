import { Typography } from 'antd'

import { IEventCardProps } from '../../../../Events/EventList/_components/EventCard/EventCard-types'
import {
	getEventDateTime,
	getEventStartTime,
} from '@utils'

import './HistoricEventCell-styles.less'

const { Text } = Typography

export function HistoricEventCell({ event }: IEventCardProps) {
	return (
		<div className="event-cell">
			<div className="event-infos">
				<Text strong>{event.event_title}</Text>
				<div className="historic-event__date-and-address">
					<Text>
						{`${getEventDateTime(event.event_date)} - ${getEventStartTime(event.event_date)}`}
					</Text>
					<Text> | </Text>
					<Text>{event.event_school_name}</Text>
				</div>
				<div className="description">
					<Text>{event.event_description}</Text>
				</div>
			</div>
			<section className="points-won">
				<p>Points gagnés : </p>
				<p className="points">{event.event_points}</p>
			</section>
		</div>
	)
}
