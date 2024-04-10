import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Calendar as AntCalendar, List, Modal, Select, Space } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/fr'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { IconButton } from '@components'
import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { Appointment, appointments } from '../appointment'

import './Calendar-styles.less'

const Calendar = () => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
	const [currentDate, setCurrentDate] = useState(dayjs())
	const [listData, setListData] = useState<Appointment[]>([])

	const supabase = useSupabase()
	const { user } = useAuth()

	const { dataevents } = useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const { data, error } = await supabase.from('events').select('*')

			if (error) {
				console.error('Error fetching events', error)
				throw error
			}

			return data
		},
	})

	const { dataappointments } = useQuery({
		queryKey: ['appointments'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('appointments')
				.select('*')
				.or(`assignee.eq.${user!.id},author_id.eq.${user!.id}`)

			if (error) {
				console.error('Error fetching appointments', error)
				throw error
			}

			return data
		},
	})

	const currentYear = dayjs().year()
	const years = useMemo(
		() => Array.from({ length: 7 }, (_, i) => currentYear - 1 + i),
		[currentYear],
	)

	useEffect(() => {
		setListData(appointments)
	}, [])

	const filterAppointments = (value: Dayjs) => {
		return listData.filter((appointment) => dayjs(appointment.date).isSame(value, 'day'))
	}

	const showAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment)
		setIsModalVisible(true)
	}

	const dateCellRender = (value: Dayjs) => {
		const filteredAppointments = filterAppointments(value)
		if (filteredAppointments.length === 0) {
			return null // or return <div></div> or any other component
		}
		return (
			<List
				dataSource={filteredAppointments}
				renderItem={(item) => (
					<List.Item key={item.name} onClick={() => showAppointmentDetails(item)}>
						<span style={{ fontWeight: 'bold', color: '#4a4a4a' }}>{item.name}</span>
					</List.Item>
				)}
			/>
		)
	}

	const updateCurrentDate = (
		operation: 'subtract' | 'add',
		value: number,
		unit: 'month' | 'year',
	) => {
		setCurrentDate((currentDate) => currentDate[operation](value, unit))
	}
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

	const handleCancel = () => {
		setIsModalVisible(false)
	}

	interface HeaderRenderParams {
		value: Dayjs
		type: string
		onChange: (value: Dayjs) => void
	}

	const headerRender = useCallback(
		({ value }: HeaderRenderParams) => {
			return (
				<Space className="events-calendar__header">
					<IconButton
						type="primary"
						size="small"
						icon={<LeftOutlined style={{ color: '#4a4a4a' }} />} // Use a minimalist icon
						onClick={handlePrevMonth}
					/>
					<Select
						size="small"
						popupMatchSelectWidth={false}
						className="my-year-select"
						onChange={handleYearSelectChange}
						value={String(currentDate.year())}
					>
						{yearOptions}
					</Select>
					<Select
						size="small"
						popupMatchSelectWidth={false}
						className="my-month-select"
						onChange={handleMonthSelectChange}
						value={String(currentDate.month())}
					>
						{monthOptions}
					</Select>
					<IconButton
						type="primary"
						size="small"
						icon={<RightOutlined style={{ color: '#4a4a4a' }} />} // Use a minimalist icon
						onClick={handleNextMonth}
					/>
				</Space>
			)
		},
		[
			handlePrevMonth,
			handleNextMonth,
			handleYearSelectChange,
			handleMonthSelectChange,
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
			/>
			<Modal
				title="Les détails de l'événement :"
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				{selectedAppointment && (
					<div>
						<p>Type: {selectedAppointment.type}</p>
						<p>Name: {selectedAppointment.name}</p>
						<p>Description: {selectedAppointment.description}</p>
						<p>Position: {selectedAppointment.position}</p>
						<p>Date: {selectedAppointment.date.format('DD/MM/YYYY')}</p>
						<p>Participant: {selectedAppointment.participant}</p>
					</div>
				)}
			</Modal>
		</>
	)
}

export { Calendar }
