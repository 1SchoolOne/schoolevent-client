import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Calendar as AntCalendar, Badge, Button, List, Select, Space } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@components'

import { ICalendarProps } from '../Calendar-types'
import { useCalendar } from './Calendar-utils'

import './Calendar-styles.less'

export function Calendar(props: ICalendarProps) {
	const navigate = useNavigate()

	const {
		currentDate,
		firstDayOfMonth,
		lastDayOfMonth,
		monthOptions,
		yearOptions,
		handlePrevMonth,
		handleNextMonth,
		handleYearSelectChange,
		handleMonthSelectChange,
		handleTodayClick,
	} = useCalendar()

	const dateCellRender = () => {
		const sortedAppointments = props.appointments.sort(
			(a, b) => dayjs(a.planned_date).valueOf() - dayjs(b.planned_date).valueOf(),
		)
		const sortedEvents = props.events.sort(
			(a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf(),
		)

		if (sortedAppointments.length === 0 && sortedEvents.length === 0) {
			return null
		}

		return (
			<div>
				<Badge
					count={sortedAppointments.length}
					style={{ backgroundColor: 'orange', marginRight: '10px' }}
				/>
				<Badge
					count={sortedEvents.length}
					style={{ backgroundColor: 'blue', marginRight: '10px' }}
				/>
				<div>
					<List
						dataSource={sortedAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<Badge dot style={{ backgroundColor: 'orange', marginRight: '10px' }} />
								<span className="list-item-school-name">{item.school_name}</span>
								<div className="list-item-planned-date">
									{dayjs(item.planned_date).format('HH:mm')}
								</div>
							</List.Item>
						)}
					/>
					<List
						dataSource={sortedEvents}
						renderItem={(item) => (
							<List.Item key={item.event_title}>
								<Badge dot style={{ backgroundColor: 'blue', marginRight: '10px' }} />
								<span className="list-item-event-title">{item.event_title}</span>
								<div className="list-item-event-date">{dayjs(item.event_date).format('HH:mm')}</div>
							</List.Item>
						)}
					/>
				</div>
			</div>
		)
	}

	const headerRender = () => {
		return (
			<Space className="events-calendar__header">
				<IconButton type="primary" size="small" icon={<LeftOutlined />} onClick={handlePrevMonth} />
				<Select
					size="small"
					popupMatchSelectWidth={false}
					onChange={handleYearSelectChange}
					value={currentDate.year().toString()}
				>
					{yearOptions}
				</Select>
				<Select
					size="small"
					popupMatchSelectWidth={false}
					onChange={handleMonthSelectChange}
					value={currentDate.month()}
				>
					{monthOptions}
				</Select>
				<IconButton
					type="primary"
					size="small"
					icon={<RightOutlined />}
					onClick={handleNextMonth}
				/>
				<Button type="primary" size="small" onClick={handleTodayClick}>
					Aujourd'hui
				</Button>
				<Button type="default" size="small" onClick={() => navigate(`/appointments?action=new`)}>
					Créer un rendez-vous
				</Button>
				<Button type="default" size="small" onClick={() => navigate(`/events/new`)}>
					Créer un évenement
				</Button>
			</Space>
		)
	}

	return (
		<AntCalendar
			className="events-calendar"
			headerRender={headerRender}
			value={currentDate}
			cellRender={dateCellRender}
			validRange={[firstDayOfMonth, lastDayOfMonth]}
		/>
	)
}
