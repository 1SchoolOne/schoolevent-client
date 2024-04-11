import { Card, List } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSupabase } from '@utils'

import { TEventTypeValue } from '../EventForm/EventForm-types'
import { IEventFormFields } from '../type'

import './EventList-styles.less'

export function EventList() {
	const supabase = useSupabase()
	const [events, setEvents] = useState<IEventFormFields[]>([])
	const navigate = useNavigate()

	const fetchEvents = async () => {
		const { data, error } = await supabase.from('events').select('*')
		if (error) {
			console.error('Error fetching events:', error)
			return []
		}
		setEvents(data as IEventFormFields[])
	}

	useEffect(() => {
		fetchEvents()
	}, [])

	const handleEventClick = (eventId: number) => {
		navigate(`/events/${eventId}`)
	}

	return (
		<Card>
			<List
				itemLayout="vertical"
				size="large"
				pagination={{
					onChange: (page) => {
						console.log(page)
					},
					pageSize: 3,
				}}
			>
				{events.map((event) => (
					<List.Item
						key={event.id}
						extra={
							<img width={200} alt="logo" src={event.event_background} className="imageList" />
						}
						onClick={() => handleEventClick(event.id)}
					>
						<Link to={`/events/${event.id}`} key={event.id}></Link>
						<List.Item.Meta
							className="event-item"
							title={event.event_title}
							description={`${
								event.event_type === ('open_day' as TEventTypeValue)
									? 'Porte ouverte'
									: event.event_type === 'presentation'
									? 'Présentation'
									: 'Conférence'
							} - ${event.event_school_name} - ${event.event_address}`}
						/>
						<h4>
							{`${new Date(event.event_date).toLocaleDateString('fr-FR', {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
							})} -  ${event.event_duration / 3600}h`}
						</h4>
						{/* voir si on le garde ou pas */}
						{/* 
						{event.event_creator_id}
						<Card>{event.event_description}</Card> */}
					</List.Item>
				))}
			</List>
		</Card>
	)
}
