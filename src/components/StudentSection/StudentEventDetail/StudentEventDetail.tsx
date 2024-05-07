import { Button, Card, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useSupabase } from '../../../utils/useSupabase'
import { IEventFormFields } from '../../Events/type'

import './StudentEventDetail-styles.less'

export function StudentEventDetail() {
	const { eventId } = useParams()
	const [event, setEvent] = useState<IEventFormFields>()

	const supabase = useSupabase

	useEffect(() => {
		const fetchEventData = async () => {
			try {
				const { data, error } = await supabase()
					.from('events')
					.select('*')
					.eq('id', eventId!)
					.single()

				if (error) {
					throw error
				}

				setEvent(data as IEventFormFields)
			} catch (error) {
				console.error('Error fetching event data:', error)
			}
		}
		fetchEventData()
	}, [eventId, supabase])

	return (
		<div className="container">
			<div className="event-participation">
				<h2>A Savoir !</h2>
				<p>
					<strong>X</strong> personnes ont déjà postulés à cet évènement.
				</p>
				<h3>Veux-tu participer ?</h3>
				<div className="button-question-div">
					<Button className="secondary">Non</Button>
					<Button className="primary">Oui</Button>
				</div>
			</div>
			<div className="event-container">
				{event ? (
					<Card>
						<Row justify="center">
							<Card
								className="cardContent"
								style={{
									backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${event.event_background})`,
								}}
							>
								<Row justify="center" align="middle">
									<Typography className="header" style={{ zIndex: 1 }}>
										{new Date(event.event_date)
											.toLocaleDateString('fr-FR', {
												weekday: 'long',
												day: 'numeric',
												month: 'long',
											})
											.toUpperCase()}
									</Typography>

									<Typography className="header"> , {event.event_school_name} </Typography>

									<Typography className="header"> , {event.event_address}</Typography>
								</Row>
								<Row justify="center" align="middle">
									<Typography.Title level={2} style={{ color: 'white', zIndex: 1 }}>
										{event.event_title}
									</Typography.Title>
								</Row>
							</Card>
						</Row>
						<Row justify="center" className="DetailEvent">
							<Typography.Title level={3}>
								{new Date(event.event_date)
									.toLocaleDateString('fr-FR', {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
									})
									.toUpperCase()}{' '}
								à{' '}
								{new Date(event.event_date).toLocaleTimeString('fr-FR', {
									hour: 'numeric',
									hour12: false,
								})}
								. Pour une durée de : {event.event_duration / 3600}h
							</Typography.Title>
						</Row>

						<Row justify="space-around" align="middle">
							<Card className="descriptif">
								<Typography> {event.event_description}</Typography>
							</Card>
						</Row>
					</Card>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</div>
	)
}
