import { ChatDots as MessageIcon, Paperclip as PaperclipIcon } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { Avatar, Space, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useDrag } from 'react-dnd'
import { useNavigate } from 'react-router-dom'

import { getNameFromEmail, useSupabase } from '@utils'

import { IDragItemProps } from '../../AppointmentsLayout-types'
import { DateField } from '../AppointmentModal/_components/DateField/DateField'

import './DragItem-styles.less'

dayjs.extend(utc)
dayjs.extend(timezone)

export function DragItem({ appointment }: IDragItemProps) {
	const navigate = useNavigate()
	const supabase = useSupabase()

	const { data: attachments } = useQuery({
		queryKey: ['attachments', { appointmentId: appointment.id }],
		queryFn: async () => {
			const { data, error } = await supabase.storage
				.from('attachments')
				.list(`appointment_${appointment.id}`)

			if (error) {
				console.error(error)
				throw error
			}

			return data
		},
		initialData: [],
	})

	const userName = appointment.users ? getNameFromEmail(appointment.users.email) : null

	const [{ isDragging }, drag] = useDrag({
		type: appointment.apt_status,
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
		item: appointment,
	})

	const renderDate = () => {
		switch (appointment.apt_status) {
			case 'contacted':
				if (appointment.contacted_date) {
					return (
						<Space>
							<Typography.Text strong>Contacté le : </Typography.Text>
							<DateField value={dayjs(appointment.contacted_date)} readOnly />
						</Space>
					)
				}

				break
			case 'planned':
				if (appointment.planned_date) {
					return (
						<Space>
							<Typography.Text strong>Rendez-vous le : </Typography.Text>
							<DateField value={dayjs(appointment.planned_date)} readOnly />
						</Space>
					)
				}

				break
			default:
				return null
		}
	}

	return (
		<Space
			ref={drag}
			direction="vertical"
			className="drag-item"
			size="middle"
			style={{ opacity: isDragging ? 0.5 : 1, cursor: 'pointer' }}
			onClick={() => {
				navigate(`/appointments?action=edit&id=${appointment.id}`)
			}}
		>
			<Space direction="vertical" size={0}>
				<Typography.Text strong>{appointment.school_name}</Typography.Text>
				<Space>
					<Typography.Text type="secondary">{appointment.school_postal_code}</Typography.Text>
					<Typography.Text type="secondary">{appointment.school_city}</Typography.Text>
				</Space>
			</Space>

			<Space direction="vertical" size={0}>
				{appointment.contact_phone && (
					<Space>
						<Typography.Text strong>Téléphone : </Typography.Text>
						<Typography.Text>{appointment.contact_phone}</Typography.Text>
					</Space>
				)}

				{appointment.contact_name && (
					<Space>
						<Typography.Text strong>Contact : </Typography.Text>
						<Typography.Text>{appointment.contact_name}</Typography.Text>
					</Space>
				)}
			</Space>

			{renderDate()}

			<div className="drag-item__footer">
				{appointment.users && (
					<div className="drag-item__footer__item avatar">
						<Tooltip title={userName?.name} placement="right" mouseEnterDelay={0.5}>
							<Avatar style={{ background: 'var(--ant-color-primary)' }}>
								{userName?.initials}
							</Avatar>
						</Tooltip>
					</div>
				)}
				<div className="drag-item__footer__item">
					<Typography.Text type="secondary">0</Typography.Text>
					<MessageIcon size={16} />
				</div>
				<div
					className="drag-item__footer__item"
					title={`${attachments.length} pièce${attachments.length > 1 ? 's' : ''} jointe${
						attachments.length > 1 ? 's' : ''
					}`}
				>
					<Typography.Text type="secondary">{attachments.length}</Typography.Text>
					<PaperclipIcon size={16} />
				</div>
			</div>
		</Space>
	)
}
