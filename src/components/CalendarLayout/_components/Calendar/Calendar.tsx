import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Calendar as AntCalendar, Badge, Button, List, Select, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/fr'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@components'

import { ICalendarProps } from './Calendar-types'
import { useCalendar } from './Calendar-utils'

import './Calendar-styles.less'

export function Calendar(props: ICalendarProps) {
	const navigate = useNavigate()

	const {
		currentDate,
		firstDayOfMonth,
		lastDayOfMonth,
		filterEvents,
		filterAppointments,
		monthOptions,
		yearOptions,
		handlePrevMonth,
		handleNextMonth,
		handleYearSelectChange,
		handleMonthSelectChange,
		handleTodayClick,
	} = useCalendar({ ...props, navigate })

	const dateCellRender = (value: Dayjs) => {
		const filteredAppointments = filterAppointments(value).sort(
			(a, b) => dayjs(a.planned_date).valueOf() - dayjs(b.planned_date).valueOf(),
		)
		const filteredEvents = filterEvents(value).sort(
			(a, b) => dayjs(a.event_date).valueOf() - dayjs(b.event_date).valueOf(),
		)
		if (filteredAppointments.length === 0 && filteredEvents.length === 0) {
			return null
		}
		return (
			<div>
				<Badge
					count={filteredAppointments.length}
					style={{ backgroundColor: 'orange', marginRight: '10px' }}
				/>
				<Badge
					count={filteredEvents.length}
					style={{ backgroundColor: 'blue', marginRight: '10px' }}
				/>
				<div>
					<List
						dataSource={filteredAppointments}
						renderItem={(item) => (
							<List.Item key={item.school_name}>
								<Badge dot style={{ backgroundColor: 'orange', marginRight: '10px' }} />
								<span style={{ fontWeight: 'bold', color: '#4a4a4a' }}>{item.school_name}</span>
								<div style={{ color: '#4a4a4a' }}>{dayjs(item.planned_date).format('HH:mm')}</div>
							</List.Item>
						)}
					/>
					<List
						dataSource={filteredEvents}
						renderItem={(item) => (
							<List.Item key={item.event_title}>
								<Badge dot style={{ backgroundColor: 'blue', marginRight: '10px' }} />
								<span style={{ fontWeight: 'bold', color: '#4a4a4a' }}>{item.event_title} </span>
								<div style={{ color: '#4a4a4a' }}>{dayjs(item.event_date).format('HH:mm')}</div>
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
				<IconButton
					type="primary"
					size="small"
					icon={<LeftOutlined />}
					onClick={handlePrevMonth}
				/>
				<Select
					size="small"
					popupMatchSelectWidth={false}
					onChange={handleYearSelectChange}
					value={String(currentDate.year())}
				>
					{yearOptions}
				</Select>
				<Select
					size="small"
					popupMatchSelectWidth={false}
					onChange={handleMonthSelectChange}
					value={String(currentDate.month())}
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
		<>
			<AntCalendar
				className="events-calendar"
				headerRender={headerRender}
				value={currentDate}
				cellRender={dateCellRender}
				validRange={[firstDayOfMonth, lastDayOfMonth]}
			/>
		</>
	)
}
