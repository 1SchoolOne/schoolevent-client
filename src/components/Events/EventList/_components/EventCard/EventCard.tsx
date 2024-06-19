import { ArrowRight } from '@phosphor-icons/react'
import { Card } from 'antd'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { IEventCardProps } from './EventCard-types'
import { formatEventDuration, getEventStartTime, getEventTypeLabel } from './EventCard-utils'

import './EventCard-styles.less'

export function EventCard({ event }: IEventCardProps) {
	return (
		<Card
			className={classNames('event-card', {
				'event-card--has-background': !!event.event_background,
			})}
			data-title={event.event_title}
			title={!event.event_background ? event.event_title : undefined}
			cover={
				event.event_background ? (
					<img className="img-cover" alt="event-cover" src={event.event_background} />
				) : undefined
			}
		>
			<div className="event-card__points-and-date">
				<p><span>{event.event_points}</span> pts</p>
				<p className="event-card__date">
					{`${new Date(event.event_date).toLocaleDateString('fr-FR', {
						weekday: 'long',
						day: 'numeric',
						month: 'long',
					})} - ${getEventStartTime(event.event_date)}`}
				</p>
			</div>
			<p className="event-card__school-and-address">
				{event.event_school_name} - {event.event_address}
			</p>
			<p className="event-card__type">{getEventTypeLabel(event.event_type)}</p>
			<p className="event-card__duration">
				Durée : {formatEventDuration(event.event_duration / 3600)}
			</p>
			<Link className="event-card__link" to={`/events/view/${event.id}`}>
				Voir les détails
				<ArrowRight size={16} />
			</Link>
		</Card>
	)
}
