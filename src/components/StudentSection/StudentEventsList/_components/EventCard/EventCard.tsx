import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Button, Card } from 'antd'

import { TEventTypeValue } from '../../../../Events/EventForm/EventForm-types'
import { IEventCardProps } from './EventCard-types'
import { formatEventDuration, getEventStartTime } from './EventCard-utils'

import './EventCard-styles.less'

export function EventCard(props: IEventCardProps) {
	const { event, onClick } = props

	return (
		<Card
			hoverable
			className="event-card"
			cover={<img className="img-cover" alt="event-cover" src={event.event_background} />}
			onClick={onClick}
		>
			<div className="event-favorite">
				<Button
					className="favorite-button"
					onClick={async () => {
						//await handleFavorites(record)
					}}
					icon={<FavoriteIcon size="1rem" />}
					type="text"
					aria-label="Ajouter aux favoris"
				/>
			</div>
			<div className="card-title">
				<p>{event.event_title}</p>
			</div>
			<div className="card-date">
				<p>
					{`${new Date(event.event_date).toLocaleDateString('fr-FR', {
						weekday: 'long',
						day: 'numeric',
						month: 'long',
					})} - ${getEventStartTime(event.event_date)}`}
				</p>
			</div>
			<p>
				{event.event_school_name} - {event.event_address}
			</p>
			<p>
				{event.event_type === ('open_day' as TEventTypeValue)
					? 'Porte ouverte'
					: event.event_type === 'presentation'
					? 'Présentation'
					: 'Conférence'}
			</p>
			<p>Durée : {formatEventDuration(event.event_duration / 3600)}</p>
		</Card>
	)
}
