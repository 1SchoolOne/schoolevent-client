import { Button, Card, Collapse, List } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSupabase } from '../../../utils/useSupabase'
import { IEventFormFields } from '../../Events/type'
import { Star as FavoriteIcon } from '@phosphor-icons/react'

import './StudentEventsList-styles.less'
import { TEventTypeValue } from '../../Events/EventForm/EventForm-types'
import dayjs from 'dayjs'

export function StudentEventList() {
	const supabase = useSupabase()
	const navigate = useNavigate()

	const { Panel } = Collapse

	type EventsByMonth = {
		[key: number]: IEventFormFields[]
	}

	const [eventsByMonth, setEventsByMonth] = useState<EventsByMonth>({})
	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchEvents = async () => {
		const { data, error } = await supabase.from('events').select('*')
		if (error) {
			console.error('Error fetching events:', error)
			return []
		}
		const eventsData = data as IEventFormFields[]

		const eventsGroupByMonth: EventsByMonth = eventsData.reduce((acc: EventsByMonth, event) => {
			const month = new Date(event.event_date).getMonth()
			acc[month] = acc[month] || []
			acc[month].push(event)
			return acc
		}, {})

		setEventsByMonth(eventsGroupByMonth)
	}

	useEffect(() => {
		fetchEvents()
	}, [fetchEvents])

	const handleEventClick = (eventId: number) => {
		navigate(`/studentEvents/${eventId}`)
	}

	const capitalizeFirstLetter = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1)
	}
	
	const getEventStartTime = (event: IEventFormFields) => {
		const eventTime = dayjs(event.event_date)
    return `${eventTime.hour()}h${eventTime.minute()}`
  }

	const formatEventDuration = (duration: number) => {
		if(duration < 1) {
			return `${duration * 60} min`
		} else {
			const hours = Math.floor(duration)
			const minutes = (duration - hours) * 60
			if(minutes === 0) {
				return `${hours}h`
			} else {
				return `${hours}h${minutes}min`
			}
		}
	}

	const customPanelStyle = {
    border: 0,
  }

	return (
		<Collapse accordion style={{ border: 'none' }}>
			{Object.entries(eventsByMonth).map(([month, events]) => (
				<Panel
					header={capitalizeFirstLetter(new Date(0, parseInt(month)).toLocaleString('default', { month: 'long' }))}
					key={month}
					style={customPanelStyle}
				>
					<List
						grid={{ gutter: 20, column: 3 }}
						dataSource={events}
						renderItem={(event) => (
							<List.Item key={event.id} onClick={() => handleEventClick(event.id)}>
								<Link to={`/studentEvents/${event.id}`} key={event.id}></Link>
								<Card
									hoverable
									className="event-card"
									cover={
										<img className="img-cover" alt="event-cover" src={event.event_background} />
									}
								>
									<div className="event-favorite">
									<Button
									className="favorite-button"
									onClick={async () => {
										//await handleFavorites(record)
									}}
									icon={<FavoriteIcon size="1rem"/>}
									type="text"
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
											})} - ${getEventStartTime(event)}`}
										</p>
									</div>
									<p>
										{event.event_school_name} - {event.event_address}
									</p>
									<p>
										{event.event_type === 'open_day' as TEventTypeValue
											? 'Porte ouverte'
											: event.event_type === 'presentation'
											? 'Présentation'
											: 'Conférence'}
									</p>
									<p>Durée : {formatEventDuration(event.event_duration / 3600)}</p>
								</Card>
							</List.Item>
						)}
					></List>
				</Panel>
			))}
		</Collapse>
	)
}
