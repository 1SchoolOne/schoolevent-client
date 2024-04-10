import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Button, Flex, Input, List, Space } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useState } from 'react'

import { ICalendarListProps } from './CalendarList-types'

import './CalendarList-styles.less'

export function CalendarList(props: ICalendarListProps) {
	const { events, appointments } = props
	const [search, setSearch] = useState('')
	const [selectedButton, setSelectedButton] = useState('appointments')

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const handleButtonClick = (button: string) => {
		setSelectedButton(button)
	}

	const filteredEvents = events.filter((event) => {
		const matchName = event.event_title.toLowerCase().includes(search.toLowerCase())
		const matchPosition = event.event_address.toLowerCase().includes(search.toLowerCase())
		const matchDate = event.event_date
			? event.event_date.toString().toLowerCase().includes(search.toLowerCase())
			: false
		return matchName || matchPosition || matchDate
	})

	const filteredAppointments = appointments.filter((appointment) => {
		const matchName = appointment.school_name.toLowerCase().includes(search.toLowerCase())
		const matchPosition = appointment.school_city.toLowerCase().includes(search.toLowerCase())
		const matchDate = appointment.planned_date
			? appointment.planned_date.toString().toLowerCase().includes(search.toLowerCase())
			: false
		return matchName || matchPosition || matchDate
	})

	return (
		<Space className="calendar-list" direction="vertical">
			<Input
				placeholder={
					selectedButton === 'appointments'
						? 'Rechercher mes rendez-vous'
						: 'Rechercher mes événements'
				}
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<Space>
				<Button
					type={selectedButton === 'appointments' ? 'primary' : 'default'}
					onClick={() => handleButtonClick('appointments')}
				>
					Rendez-vous
				</Button>
				<Button
					type={selectedButton === 'events' ? 'primary' : 'default'}
					onClick={() => handleButtonClick('events')}
				>
					Événements
				</Button>
			</Space>
			{selectedButton === 'appointments' && (
				<List
					dataSource={filteredAppointments}
					renderItem={(item) => (
						<List.Item key={item.school_name}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.school_name}
								description={
									<Flex justify="space-between">
										<i>
											{item.school_city} -{' '}
											{item.planned_date ? dayjs(item.planned_date).format('DD/MM/YYYY') : 'N/A'}
										</i>
									</Flex>
								}
							/>
						</List.Item>
					)}
				/>
			)}
			{selectedButton === 'events' && (
				<List
					dataSource={filteredEvents}
					renderItem={(item) => (
						<List.Item key={item.event_title}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.event_title}
								description={
									<Flex justify="space-between">
										<i>
											{item.event_address} -{' '}
											{item.event_date ? dayjs(item.event_date).format('DD/MM/YYYY') : 'N/A'}
										</i>
									</Flex>
								}
							/>
						</List.Item>
					)}
				/>
			)}
		</Space>
	)
}
