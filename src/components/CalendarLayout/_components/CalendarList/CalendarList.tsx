import {
	DotsThreeVertical as MoreIcon,
	MagnifyingGlass as SearchIcon,
} from '@phosphor-icons/react'
import { Badge, Dropdown, Flex, Input, List, Segmented, Typography } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { IconButton } from '@components'

import { ICalendarListProps } from './CalendarList-types'
import { useCalendarList } from './CalendarList-hooks'

import '../../../FavoritesList/FavoritesList-styles.less'
import './CalendarList-styles.less'

export function CalendarList(props: ICalendarListProps) {
	const {
		selectedButton,
		sortedAndFilteredEvents,
		sortedAndFilteredAppointments,
		handleSearchChange,
		handleSegmentChange,
		getAppointmentsMenu,
		getEventsMenu
	} = useCalendarList(props)

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
										<Dropdown
											menu={{ items: getEventsMenu(item.id.toString()) }}
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
