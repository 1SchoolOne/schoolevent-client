import { useCallback, useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { Select } from 'antd'
import { UseCalendarProps } from './Calendar-types'

export function useCalendar({ appointments, events }: UseCalendarProps) {
	const [currentDate, setCurrentDate] = useState(dayjs())
	const currentYear = dayjs().year()
	const years = useMemo(
		() => Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
		[currentYear],
	)

	const firstDayOfMonth = currentDate.clone().startOf('month')
	const lastDayOfMonth = currentDate.clone().endOf('month')

	const filterEvents = useCallback((value: Dayjs) => {
		return events.filter((event) => dayjs(event.event_date).isSame(value, 'day'))
	}, [events])

	const filterAppointments = useCallback((value: Dayjs) => {
		return appointments.filter((appointment) =>
			dayjs(appointment.planned_date).isSame(value, 'day'),
		)
	}, [appointments])

	const updateCurrentDate = useCallback(
		(operation: 'subtract' | 'add', value: number, unit: 'month' | 'year') => {
			setCurrentDate((currentDate) => currentDate[operation](value, unit))
		},
		[],
	)

	const monthOptions = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const month = currentDate.locale('fr').month(i).format('MMM')
			return (
				<Select.Option className="month-item" key={i} value={i}>
					{month}
				</Select.Option>
			)
		})
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
		(newMonth: number) => {
			const updatedValue = currentDate.clone().month(newMonth)
			setCurrentDate(updatedValue)
		},
		[currentDate, setCurrentDate],
	)

	const handleTodayClick = useCallback(() => setCurrentDate(dayjs()), [])

	return {
		currentDate,
		firstDayOfMonth,
		lastDayOfMonth,
		filterEvents,
		filterAppointments,
		updateCurrentDate,
		monthOptions,
		yearOptions,
		handlePrevMonth,
		handleNextMonth,
		handleYearSelectChange,
		handleMonthSelectChange,
		handleTodayClick,
	}
}
