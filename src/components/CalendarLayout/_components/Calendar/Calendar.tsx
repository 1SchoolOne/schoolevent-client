import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Calendar as AntCalendar, Badge, Button, List, Select, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/fr'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IconButton } from '@components'

import { ICalendarProps } from './Calendar-types'

import './Calendar-styles.less'

export function Calendar(props: ICalendarProps) {
	const { events, appointments } = props
	const navigate = useNavigate()
	const [currentDate, setCurrentDate] = useState(dayjs())
	const currentYear = dayjs().year()
	const years = useMemo(
		() => Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
		[currentYear],
	)

	const firstDayOfMonth = currentDate.clone().startOf('month')
	const lastDayOfMonth = currentDate.clone().endOf('month')

	const filterEvents = (value: Dayjs) => {
		return events.filter((event) => dayjs(event.event_date).isSame(value, 'day'))
	}

	const filterAppointments = (value: Dayjs) => {
		return appointments.filter((appointment) =>
			dayjs(appointment.planned_date).isSame(value, 'day'),
		)
	}

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
					style={{ backgroundColor: 'orange', marginRight: '5px' }}
				/>
				<Badge
					count={filteredEvents.length}
					style={{ backgroundColor: 'blue', marginRight: '5px' }}
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

	const updateCurrentDate = useCallback(
		(operation: 'subtract' | 'add', value: number, unit: 'month' | 'year') => {
			setCurrentDate((currentDate) => currentDate[operation](value, unit))
		},
		[],
	)

	const monthOptions = useMemo(() => {
		const options = []
		const current = currentDate.clone()
		const months = []
		for (let i = 0; i < 12; i++) {
			months.push(current.locale('fr').month(i).format('MMM'))
		}
		for (let index = 0; index < 12; index++) {
			options.push(
				<Select.Option className="month-item" key={`${index}`}>
					{months[index]}
				</Select.Option>,
			)
		}
		return options
	}, [currentDate])

	const yearOptions = useMemo(() => {
		return years.map((year) => (
			<Select.Option key={year} value={String(year)}>
				{year}
			</Select.Option>
		))
	}, [years])

	const handlePrevMonth = useCallback(
		() => updateCurrentDate('subtract', 1, 'month'),
		[updateCurrentDate],
	)
	const handleNextMonth = useCallback(
		() => updateCurrentDate('add', 1, 'month'),
		[updateCurrentDate],
	)
	const handleYearSelectChange = useCallback(
		(newYear: string) => {
			const updatedValue = currentDate.clone().year(Number(newYear))
			setCurrentDate(updatedValue)
		},
		[currentDate, setCurrentDate],
	)
	const handleMonthSelectChange = useCallback(
		(newMonth: string) => {
			const updatedValue = currentDate.clone().month(Number(newMonth))
			setCurrentDate(updatedValue)
		},
		[currentDate, setCurrentDate],
	)

	const handleTodayClick = useCallback(() => setCurrentDate(dayjs()), [])

	interface HeaderRenderParams {
		value: Dayjs
		type: string
		onChange: (value: Dayjs) => void
	}

	const headerRender = useCallback(
		(_: HeaderRenderParams) => {
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
		},
		[
			handlePrevMonth,
			handleNextMonth,
			handleYearSelectChange,
			handleMonthSelectChange,
			handleTodayClick,
			navigate,
			currentDate,
			yearOptions,
			monthOptions,
		],
	)

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
