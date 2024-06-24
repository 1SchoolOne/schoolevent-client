import { DotsThreeVertical as MoreIcon, MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Badge, Dropdown, Flex, Input, List, Segmented, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { IconButton } from '@components'
import { getNameFromEmail } from '@utils'

import { ICalendarListProps } from '../Calendar-types'
import { useCalendarList } from './CalendarList-utils'

import '../../../FavoritesList/FavoritesList-styles.less'
import './CalendarList-styles.less'

function RendezVousOption() {
	return (
		<div className="option-container">
			<Badge color="orange" />
			<div className="option-text">Rendez-vous</div>
		</div>
	)
}

function EvenementOption() {
	return (
		<div className="option-container">
			<Badge color="blue" />
			<div className="option-text">Événement</div>
		</div>
	)
}

export function CalendarList(props: ICalendarListProps) {
	const {
		selectedButton,
		events,
		appointments,
		handleSearchChange,
		handleSegmentChange,
		getAppointmentsMenu,
		getEventsMenu,
	} = useCalendarList(props)

	const futureAppointments = appointments.filter((a) => dayjs(a.planned_date).isAfter(dayjs()))
	const futureEvents = events.filter((e) => dayjs(e.event_date).isAfter(dayjs()))

	return (
		<div className="favorites-list">
			<Typography.Title className="favorites-list__title" level={5}>
				Vos rendez-vous et événements
			</Typography.Title>
			<Input
				className="favorites-list__search"
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
					dataSource={futureAppointments}
					renderItem={(item) => (
						<List.Item key={item.school_name?.toString() || ''}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.school_name?.toString() || ''}
								description={
									<Flex justify="space-between">
										<div>
											<div>
												<strong>Adresse : </strong> <br />
												{item.school_address?.toString() || ''}{' '}
												{item.school_postal_code?.toString() || ''}{' '}
												{item.school_city?.toString() || ''}
											</div>
											<br />
											<strong>Information :</strong> <br />
											<div>
												<strong>Le </strong>
												{item.planned_date &&
													dayjs(item.planned_date.toString()).format('DD/MM/YYYY')}{' '}
												<strong>à </strong>
												{item.planned_date
													? dayjs(item.planned_date.toString()).format('HH:mm')
													: 'N/A'}
											</div>
											<strong>Assigné à : </strong>
											{getNameFromEmail(item.users?.email || '').name}
										</div>
										<Dropdown menu={{ items: getAppointmentsMenu(item.id) }} trigger={['click']}>
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
					dataSource={futureEvents}
					renderItem={(item) => (
						<List.Item key={item.event_title?.toString() || ''}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.event_title?.toString() || ''}
								description={
									<Flex justify="space-between">
										<i>
											{item.event_address?.toString() || ''} -
											{getNameFromEmail(item.users?.email || '').name}
											<div>
												{item.event_date
													? dayjs(item.event_date.toString()).format('HH:mm')
													: 'N/A'}
											</div>
											{item.event_date
												? dayjs(item.event_date.toString()).format('DD/MM/YYYY')
												: 'N/A'}
										</i>
										<Dropdown
											menu={{ items: getEventsMenu(item.id?.toString() || '') }}
											trigger={['click']}
										>
											<IconButton type="text" icon={<MoreIcon size={16} weight="bold" />} />
										</Dropdown>
									</Flex>
								}
							/>
						</List.Item>
					)}
				/>
			)}
		</div>
	)
}
