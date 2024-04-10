import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Card, Row, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import 'react-router-dom'
import 'react-router-dom'

import { getNameFromEmail } from '../../../utils/getNameFromEmail'
import { useSupabase } from '../../../utils/useSupabase'
import { IEventFormFields, IUser } from '../type'

import './EventDetail-styles.less'

export const EventDetail = () => {
	const { eventId } = useParams()
	const [event, setEvent] = useState<IEventFormFields>()
	const [userEmail, setUserEmail] = useState<IUser[]>()
	const supabase = useSupabase

	const navigate = useNavigate()

	const listUser = [{ name: 'user1' }, { name: 'user2' }, { name: 'user3' }]

	useEffect(() => {
		const fetchUserEmails = async () => {
			try {
				const { data, error } = await supabase()
					.from('users')
					.select('*')
					.in('role', ['manager', 'admin'])

				if (error) {
					throw error
				}

				setUserEmail(data)
			} catch (error) {
				console.error('Error fetching user emails:', error)
			}
		}

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
		fetchUserEmails()
		fetchEventData()
	}, [eventId, supabase])

	//TODO Préparation pour la feature du update d'un envent
	const handleEditClick = () => {
		navigate(`/events/${eventId}/edit`)
	}

	return (
		<div>
			{event ? (
				<>
					<Card>
						<Row justify="center">
							<Card
								className="cardContent"
								style={{
									backgroundImage: `url(${event.event_background}) `,
									backgroundRepeat: 'no-repeat',
									backgroundSize: 'cover',
									width: '60%',
									filter: 'brightness(50%)',
								}}
							>
								<Row justify="center" align="middle">
									<Typography className="header">
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
									<Typography.Title level={2} style={{ color: 'white' }}>
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

							<Row style={{ flexDirection: 'column', alignItems: 'center' }}>
								<Card className="referent">
									<Row justify="center">
										<Select
											placeholder="Sélectionner référent"
											options={userEmail?.map((user) => ({
												label: getNameFromEmail(user.email).name,
												value: getNameFromEmail(user.email).name,
											}))}
										/>
									</Row>
								</Card>

								<Card className="participants">
									<Typography>Liste des participants: </Typography>
									{listUser.map((user) => (
										<Row justify="center" key={user.name}>
											<Typography>{user.name}</Typography>
											<CheckOutlined />
											<CloseOutlined />
										</Row>
									))}
								</Card>
							</Row>
						</Row>

						<Row justify="center" className="button">
							<Button
								type="primary"
								onClick={() => {
									handleEditClick()
								}}
							>
								Modifier
							</Button>
						</Row>
					</Card>
				</>
			) : (
				<p>Loading...</p>
			)}
		</div>
	)
}
