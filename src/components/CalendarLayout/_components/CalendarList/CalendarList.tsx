import {
	DotsThreeVertical as MoreIcon,
	PencilSimple as PencilSimpleIcon,
	MagnifyingGlass as SearchIcon,
} from '@phosphor-icons/react'
import { Badge, Dropdown, Flex, Input, List, Segmented, Space } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@components'

import { ICalendarListProps } from './CalendarList-types'

import '../../../FavoritesList/FavoritesList-styles.less'
import './CalendarList-styles.less'

export function CalendarList(props: ICalendarListProps) {
	const { events, appointments } = props
	const [search, setSearch] = useState('')
	const [selectedButton, setSelectedButton] = useState('Rendez-vous')
	const navigate = useNavigate()
	const currentDate = dayjs()

	const sortedAndFilteredEvents = events
		.filter((event) => dayjs(event.event_date).isAfter(currentDate))
		.sort((a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf())

	const sortedAndFilteredAppointments = appointments
		.filter((appointment) => dayjs(appointment.planned_date).isAfter(currentDate))
		.sort((a, b) => dayjs(a.planned_date).valueOf() - dayjs(b.planned_date).valueOf())
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	const handleSegmentChange = (value: string | number) => {
		if (typeof value === 'string') {
			setSelectedButton(value)
		}
	}

	const getMenuAppointments = (id: number): ItemType[] => [
		{
			key: 'create-follow-up',
			label: 'Modifier le rendez-vous',
			icon: <PencilSimpleIcon size={16} weight="bold" />,
			onClick: () => navigate(`/appointments?action=edit&id=${id}`),
		},
	]

	const getMenuEvents = (id: string): ItemType[] => [
		{
			key: 'create-follow-up',
			label: "Modifier l'événement",
			icon: <PencilSimpleIcon size={16} weight="bold" />,
			// onClick: () => navigate(`/appointments?action=edit&id=${id}`),
		},
	]

	const RendezVousOption = () => (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Badge color="orange" />
			<div style={{ marginLeft: '5px' }}>Rendez-vous</div>
		</div>
	)

	const EvenementOption = () => (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<Badge color="blue" />
			<div style={{ marginLeft: '5px' }}>Événement</div>
		</div>
	)

	return (
		<Space className="calendar-list" direction="vertical">
			<Input
				className="calendar-list__input"
				placeholder={
					selectedButton === 'Rendez-vous'
						? 'Rechercher mes rendez-vous'
						: 'Rechercher mes événements'
				}
				prefix={<SearchIcon />}
				onChange={handleSearchChange}
			/>
			<Segmented
				className="calendar-list__segmented"
				options={[
					{ label: <RendezVousOption />, value: 'Rendez-vous' },
					{ label: <EvenementOption />, value: 'Événement' },
				]}
				value={selectedButton}
				onChange={handleSegmentChange}
			/>
			{selectedButton === 'Rendez-vous' && (
				<List
					className="favorites-list__list"
					locale={{
						emptyText: 'Aucun rendez-vous',
					}}
					dataSource={sortedAndFilteredAppointments}
					renderItem={(item) => (
						<List.Item key={item.school_name}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.school_name}
								description={
									<Flex justify="space-between">
										<i>
											{item.school_city} -{' '}
											<div>
												{item.planned_date ? dayjs(item.planned_date).format('HH:mm') : 'N/A'}
											</div>
											{item.planned_date ? dayjs(item.planned_date).format('DD/MM/YYYY') : 'N/A'}
										</i>
										<Dropdown menu={{ items: getMenuAppointments(item.id) }} trigger={['click']}>
											<IconButton type="text" icon={<MoreIcon size={16} weight="bold" />} />
										</Dropdown>
									</Flex>
								}
							/>
						</List.Item>
					)}
				/>
			)}
			{selectedButton === 'Événement' && (
				<List
					className="favorites-list__list"
					locale={{
						emptyText: 'Aucun événement',
					}}
					dataSource={sortedAndFilteredEvents}
					renderItem={(item) => (
						<List.Item key={item.event_title}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.event_title}
								description={
									<Flex justify="space-between">
										<i>
											{item.event_address} -{' '}
											<div>{item.event_date ? dayjs(item.event_date).format('HH:mm') : 'N/A'}</div>
											{item.event_date ? dayjs(item.event_date).format('DD/MM/YYYY') : 'N/A'}
										</i>
										<Dropdown menu={{ items: getMenuEvents(item.id) }} trigger={['click']}>
											<IconButton type="text" icon={<MoreIcon size={16} weight="bold" />} />
										</Dropdown>
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
