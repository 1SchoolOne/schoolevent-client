import { Card, Collapse, List } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSupabase } from '../../../utils/useSupabase'
import { IEventFormFields } from '../../Events/type'

import './StudentEventsList-styles.less'
import { TEventTypeValue } from '../../Events/EventForm/EventForm-types'

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

	const handleEventClick = (studentEventId: number) => {
		navigate(`/studentEvent/${studentEventId}`)
	}

	return (
		<Collapse accordion>
			{Object.entries(eventsByMonth).map(([month, events]) => (
				<Panel
					header={new Date(0, parseInt(month)).toLocaleString('default', { month: 'long' })}
					key={month}
				>
					<List
						grid={{ gutter: 16, column: 1 }}
						dataSource={events}
						renderItem={(event) => (
							<List.Item key={event.id} onClick={() => handleEventClick(event.id)}>
								<Link to={`/studentEvent/${event.id}`} key={event.id}></Link>
								<Card
									hoverable
									className="event-card"
									cover={
										<img className="img-cover" alt="event-cover" src={event.event_background} />
									}
								>
									<div className="card-title">
										<p>{event.event_title}</p>
									</div>
									<div className="card-date">
										<p>
											{`${new Date(event.event_date).toLocaleDateString('fr-FR', {
												weekday: 'long',
												day: 'numeric',
												month: 'long',
											})} - 10h00`}
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
									<p>Durée : {event.event_duration / 3600}h</p>
								</Card>
							</List.Item>
						)}
					></List>
				</Panel>
			))}
		</Collapse>
	)
}
