import {
	ArrowLeft,
	Calendar,
	CheckCircle,
	Trash as DeleteIcon,
	PencilSimple as EditIcon,
	MapPin,
} from '@phosphor-icons/react'
// import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, ConfigProvider, Divider, Modal, Row, Space, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { lazy, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@contexts'
import { log, useEvent, useSupabase } from '@utils'

import { BasicLayout } from '../../BasicLayout/BasicLayout'
import { preRegisterToEvent, useFetchEventData } from './EventDetail-utils'
import { Assignee } from './_components/Assignee/Assignee'
import { Skeleton } from './_components/Skeleton/Skeleton'

import './EventDetail-styles.less'

const Participants = lazy(() => import('./_components/Participants/Participants'))
const { useModal } = Modal
const { useMessage } = message

export function EventDetail() {
	const { eventId } = useParams<{ eventId: string }>()
	const { role, user } = useAuth()
	const [modal, modalContextHolder] = useModal()
	const [msg, messageContextHolder] = useMessage()
	const supabase = useSupabase()
	// const queryClient = useQueryClient()

	const navigate = useNavigate()
	const { data: event, isPending } = useEvent(eventId)

	const [registrationCount, setRegistrationCount] = useState(0)
	const [registrationMessage, setRegistrationMessage] = useState('')
	const [isRegistered, setIsRegistered] = useState(false)

	useFetchEventData(
		eventId ?? null,
		user,
		setRegistrationCount,
		setIsRegistered,
		setRegistrationMessage,
	)

	// TODO: admins should be able to have edit rights whether they are the creator/assignee or not
	const hasEditRights = event?.event_creator_id === user!.id || event?.event_assignee === user!.id

	const deleteEvent = async () => {
		const genericErrorMsg =
			"Une erreur est survenue lors de la suppression de l'événement. Veuillez rééssayer plus tard."

		if (!eventId) {
			log.error("Impossible de supprimer l'événement. `id` est `" + String(eventId) + '`')
			return Promise.reject(genericErrorMsg)
		}

		const { error } = await supabase.from('events').delete().eq('id', eventId).select().single()

		if (error) {
			log.error(error)
			return Promise.reject(genericErrorMsg)
		} else {
			return Promise.resolve('Événement supprimé avec succès.')
		}
	}

	const getRegistrationText = (count: number) => {
		if (count === 0) {
			return 'Aucune personne pré-inscrite à cet évènement.'
		} else if (count === 1) {
			return (
				<>
					<span className="people">{count}</span> personne a déjà postulé à cet évènement.
				</>
			)
		} else {
			return (
				<>
					<span className="people">{count}</span> personnes ont déjà postulés à cet évènement.
				</>
			)
		}
	}

	return isPending ? (
		<Skeleton />
	) : (
		<div className="register-container">
			{role === 'student' && (
				<div className="register-to-event">
					<Typography.Title level={4}>À savoir !</Typography.Title>
					<Typography.Text>{getRegistrationText(registrationCount)}</Typography.Text>
					<div className="btn-action-section">
						{isRegistered ? (
							<div className="success-msg-section">
								<Typography.Text>{registrationMessage}</Typography.Text>
								<CheckCircle size={30} color="var(--ant-green)" weight="fill" />
							</div>
						) : (
							<div>
								<Button
									className="pre-register-btn"
									type="primary"
									onClick={() =>
										preRegisterToEvent(
											eventId ?? null,
											user,
											msg,
											setIsRegistered,
											setRegistrationMessage,
											setRegistrationCount,
										)
									}
								>
									Me pré-inscrire
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			<BasicLayout className="event-detail">
				{modalContextHolder}
				{messageContextHolder}
				<Space className="event-detail__header">
					<Link to="/events">
						<ArrowLeft size={16} />
						Retour
					</Link>
					{hasEditRights && (
						<>
							<Button
								className="event-detail__header__edit-btn"
								type="primary"
								icon={<EditIcon size={16} />}
								onClick={() => navigate(`/events/edit/${event?.id}`)}
							>
								Modifier
							</Button>
							<Button
								className="event-detail__header__delete-btn"
								type="primary"
								icon={<DeleteIcon size={16} />}
								onClick={() => {
									modal.confirm({
										className: 'event-detail__delete-modal',
										title: "Supprimer l'événement",
										content: 'Êtes-vous sur de vouloir supprimer cet événement ?',
										okText: 'Supprimer',
										okButtonProps: { danger: true },
										cancelText: 'Annuler',
										icon: (
											<DeleteIcon
												className="event-detail__delete-modal__icon"
												size={20}
												color="var(--ant-color-error)"
											/>
										),
										onOk: async () =>
											deleteEvent()
												.then(async (successMessage) => {
													// TODO: reset events query
													await msg.success(successMessage)
													navigate('/events')
												})
												.catch((err) => msg.error(err)),
									})
								}}
								danger
							>
								Supprimer
							</Button>
						</>
					)}
				</Space>
				<div
					className="event-detail__banner"
					style={{
						backgroundColor: 'var(--ant-layout-sider-bg)',
					}}
				>
					<ConfigProvider
						theme={{
							components: { Typography: { colorText: '#fff', colorTextHeading: '#fff' } },
						}}
					>
						{event!.event_background && <img src={event!.event_background} />}
						<Typography.Title className="event-detail__banner__title">
							{event!.event_title}
						</Typography.Title>
						<div className="event-detail__banner__date-and-location">
							<Typography className="event-detail__banner__date">
								<Calendar size={16} /> {dayjs(event!.event_date).format('DD MMMM YYYY à HH')}h
								{dayjs(event!.event_date).format('mm')}
							</Typography>
							<Typography className="event-detail__banner__location">
								<MapPin size={16} /> {event!.event_address}
							</Typography>
						</div>
					</ConfigProvider>
				</div>
				<Row className="event-detail__body" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={16}>
						<Divider>Description</Divider>
						<div className="event-detail__body__description">
							<Typography.Paragraph
								className="event-detail__body__description__text"
								ellipsis={{
									rows: 10,
									expandable: true,
								}}
							>
								{event?.event_description}
							</Typography.Paragraph>
						</div>
					</Col>
					<Col span={8}>
						<Assignee assigneeId={event?.event_assignee} eventId={eventId} />
						{role !== 'student' && <Participants eventId={eventId} hasEditRights={hasEditRights} />}
					</Col>
				</Row>
			</BasicLayout>
		</div>
	)
}
