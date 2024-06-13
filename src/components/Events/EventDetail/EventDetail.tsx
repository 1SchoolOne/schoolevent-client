import {
	ArrowLeft,
	Calendar,
	Trash as DeleteIcon,
	PencilSimple as EditIcon,
	MapPin,
} from '@phosphor-icons/react'
// import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, ConfigProvider, Divider, Modal, Row, Space, Typography, message } from 'antd'
import dayjs from 'dayjs'
import { lazy } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { useAuth } from '@contexts'
import { log, useEvent, useSupabase } from '@utils'

import { BasicLayout } from '../../BasicLayout/BasicLayout'
import { Assignee } from './_components/Assignee/Assignee'
import { Skeleton } from './_components/Skeleton/Skeleton'

import './EventDetail-styles.less'

const Participants = lazy(() => import('./_components/Participants/Participants'))
const { useModal } = Modal
const { useMessage } = message

export function EventDetail() {
	const { eventId } = useParams()
	const { role, user } = useAuth()
	const [modal, modalContextHolder] = useModal()
	const [msg, messageContextHolder] = useMessage()
	const supabase = useSupabase()
	// const queryClient = useQueryClient()

	const navigate = useNavigate()
	const { data: event, isPending } = useEvent(eventId)

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

	const preRegisterToEvent = async () => {
		if (!eventId || !user?.id) {
			msg.error('La pré-inscription a échoué, veuillez réessayer plus tard')
			return
		}

		const { error } = await supabase
			.from('events_participants')
			.insert({ event_id: Number(eventId), user_id: user.id })

		if (error) {
			msg.error("Une erreur est survenue lors de l'inscription.")
			log.error(error)
		} else {
			msg.success('Inscription réussie !')
		}
	}

	return isPending ? (
		<Skeleton />
	) : (
		<div className="flex-container">
			{role === 'student' && (
				<div className="register-to-event">
					<Typography.Title level={4}>A savoir !</Typography.Title>
					<Typography.Text>
						<span className="people">50 </span>personnes ont déjà postulés à cet évènement.
					</Typography.Text>
					<Typography.Title level={4}>Veux-tu participer ?</Typography.Title>
					<div className="btn-section">
						<Button className="question-btn no">Non</Button>
						<Button className="question-btn yes" onClick={preRegisterToEvent}>
							Oui
						</Button>
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
