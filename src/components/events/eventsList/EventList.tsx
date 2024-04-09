import { Card, Collapse, List } from 'antd'
import { useEffect, useState } from 'react'

import { useSupabase } from '@utils'

import { IEventFormFields } from '../type'

import './EventList-styles.less'

export const EventList = () => {
	const supabase = useSupabase()
	const [events, setEvents] = useState<IEventFormFields[]>([])
	// const [backgroundUrl, setBackgroundURL] = useState<string>()

	// const [users, setUsers] = useState<any[]>([])

	const fetchEvents = async () => {
		const { data, error } = await supabase.from('events').select('*')
		if (error) {
			console.error('Error fetching events:', error)
			return []
		}
		setEvents(data as IEventFormFields[])
	}

	// const fetchUsers = async () => {
	// 	// Add this function
	// 	const { data, error } = await supabase.from('users').select('email')
	// 	if (error) {
	// 		console.error('Error fetching users:', error)
	// 		return []
	// 	}
	// 	setUsers(data)
	// }

	useEffect(() => {
		fetchEvents()
		// fetchUsers()
	}, [])

	// const getEmailById = (creatorId: string) => {
	// 	// Add this function
	// 	const user = users.find((user) => user.id === creatorId)
	// 	return user ? user.email : ''
	// }
	return (
		// <Card>
		// 	<List>
		// 		{events.map((event) => (
		// 			<List.Item key={event.id}>
		// 				<Flex justify="space-between">
		// 					<Row justify="space-between">
		// 						<Col span={16}>
		// 							<Col>{event.event_title}</Col>
		// 							<Col>{event.event_type}</Col>
		// 							<Col>{`${event.event_date.toString()} - ${event.event_duration.toString()}-
		// 						${event.event_address}
		// 						`}</Col>
		// 							<Col>{event.event_creator_id}</Col>
		// 							<Card>
		// 								<Col>{event.event_description}</Col>
		// 							</Card>
		// 						</Col>
		// 					</Row>

		// 					<Row justify="end">
		// 						<Col span={8}>
		// 							<img width={200} alt={event.event_background} src={event.event_background} />
		// 						</Col>
		// 					</Row>
		// 				</Flex>
		// 			</List.Item>
		// 		))}
		// 	</List>
		// </Card>
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
					<Collapse key={event.id}>
						<Collapse.Panel
							header={
								<List.Item.Meta
									style={{
										backgroundImage: `url(${event.event_background})`,
										backgroundSize: 'contain',
										backgroundPosition: 'center',
										backgroundRepeat: 'no-repeat',
										width: '100%',
										height: '100%',
									}}
									title={event.event_title}
									description={`${event.event_type} - ${event.event_school_name} - ${
										event.event_address
									}
								${new Date(event.event_date).toLocaleDateString()} - ${Math.floor(
									Number(event.event_duration) / 3600,
								)} hours`}
								/>
							}
							key={event.id}
						>
							<br />
							<Card>{`Descriptif : ${event.event_description}`}</Card>
							<br />
							{
								`Contacte de l'évenement : `
								// `${getEmailById(event.event_creator_id)}`
							}
						</Collapse.Panel>
					</Collapse>
				))}
			</List>
		</Card>
	)
}
