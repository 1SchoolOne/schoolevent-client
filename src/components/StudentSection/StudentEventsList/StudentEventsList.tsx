import { Collapse, List } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSupabase } from '../../../utils/useSupabase'
import { IEventFormFields } from '../../Events/type'
import { EventCard } from './_components/EventCard/EventCard'
import { capitalizeFirstLetter } from './_components/EventCard/EventCard-utils'

import './StudentEventsList-styles.less'

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

	const customPanelStyle = {
		border: 0,
	}

	return (
		<Collapse accordion style={{ border: 'none' }}>
			{Object.entries(eventsByMonth).map(([month, events]) => (
				<Panel
					header={capitalizeFirstLetter(
						new Date(0, parseInt(month)).toLocaleString('default', { month: 'long' }),
					)}
					key={month}
					style={customPanelStyle}
				>
					<List
						grid={{ gutter: 20, column: 3 }}
						dataSource={events}
						renderItem={(event) => (
							<List.Item key={event.id}>
								<Link to={`/studentEvents/${event.id}`} key={event.id}></Link>
								<EventCard event={event} onClick={() => handleEventClick(event.id)} />
							</List.Item>
						)}
					></List>
				</Panel>
			))}
		</Collapse>
	)
}
