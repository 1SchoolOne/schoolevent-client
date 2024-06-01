import { Check, Minus, X } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Checkbox, Divider, message as Message, Modal, Space, Typography } from 'antd'

import { SuccessButton } from '@components'
import { getNameFromEmail } from '@utils'

import { ICheckListProps, IParticipantsProps, ISimpleListProps } from './Participants-types'
import { useController } from './Participants-utils'

const { useModal } = Modal
const { useMessage } = Message

export function Participants(props: IParticipantsProps) {
	const { eventId, hasEditRights } = props

	const {
		participants,
		selectedParticipants,
		setSelectedParticipants,
		approveParticipants,
		declineParticipants,
	} = useController(eventId)

	return (
		<>
			<Divider>Participants</Divider>
			<div className="event-detail__body__participants">
				<Space direction="vertical" style={{ width: '100%' }}>
					{hasEditRights ? (
						<CheckList
							eventId={eventId}
							participants={participants}
							approveParticipants={approveParticipants}
							declineParticipants={declineParticipants}
							selectedParticipants={selectedParticipants}
							setSelectedParticipants={setSelectedParticipants}
						/>
					) : (
						<SimpleList participants={participants} />
					)}
				</Space>
			</div>
		</>
	)
}

function SimpleList({ participants }: ISimpleListProps) {
	return participants && participants.length > 0 ? (
		participants
			.sort((a, b) => {
				if (a.approved && !b.approved) {
					return -1
				} else if (!a.approved && b.approved) {
					return 1
				}

				return 0
			})
			.map((p) => (
				<div key={p.id} className="simple-list__participant">
					{p.approved ? (
						<Check className="simple-list__participant__icon" color="var(--ant-color-success)" />
					) : (
						<Minus
							className="simple-list__participant__icon"
							color="var(--ant-color-fill-secondary)"
						/>
					)}
					<Typography.Text className="simple-list__participant__name">
						{getNameFromEmail(p.users?.email ?? '').name}
					</Typography.Text>
				</div>
			))
	) : (
		<Typography.Text disabled>Aucun participant.</Typography.Text>
	)
}

function CheckList(props: ICheckListProps) {
	const {
		eventId,
		participants,
		selectedParticipants,
		setSelectedParticipants,
		approveParticipants,
		declineParticipants,
	} = props

	const [modal, modalContextHolder] = useModal()
	const [message, msgContextHolder] = useMessage()
	const queryClient = useQueryClient()

	const indeterminate =
		selectedParticipants.length > 0 && selectedParticipants.length < (participants?.length ?? 0)

	if (!participants || participants.length === 0) {
		return <Typography.Text disabled>Aucun participant.</Typography.Text>
	}

	const sortedParticipants = participants.sort((a, b) => {
		if (!a.approved && b.approved) {
			return -1
		} else if (a.approved && !b.approved) {
			return 1
		}

		return 0
	})

	const toApprove =
		participants
			?.filter((p) => selectedParticipants.includes(p.user_id) && !p.approved)
			.map((p) => ({
				id: p.id,
				event_id: p.event_id,
				user_id: p.user_id,
				approved: true,
			})) ?? []

	const toDecline =
		participants
			?.filter((p) => selectedParticipants.includes(p.user_id) && !p.approved)
			.map((p) => p.user_id) ?? []

	const enabled = participants.some((p) => selectedParticipants.includes(p.user_id) && !p.approved)

	const approveButtonDisabled = enabled ? toApprove.length === 0 : true
	const declineButtonDisabled = enabled ? toDecline.length === 0 : true

	return (
		<>
			{modalContextHolder}
			{msgContextHolder}
			<Space className="event-detail__body__participants__btn-container">
				<Checkbox
					indeterminate={indeterminate}
					checked={selectedParticipants.length === participants?.length}
					onChange={(e) => {
						if (e.target.checked) {
							setSelectedParticipants(participants.map((p) => p.user_id))
						} else {
							const alreadyApproved = participants.filter((p) => p.approved).map((p) => p.user_id)
							setSelectedParticipants(alreadyApproved)
						}
					}}
				>
					Tous
				</Checkbox>
				<SuccessButton
					size="small"
					icon={<Check />}
					disabled={approveButtonDisabled}
					onClick={() => {
						approveParticipants(toApprove)
					}}
				>
					Accepter
				</SuccessButton>
				<Button
					size="small"
					icon={<X />}
					danger
					disabled={declineButtonDisabled}
					onClick={() => {
						modal.confirm({
							className: 'participants__decline-modal',
							title: 'Refuser la participation',
							content: 'Êtes-vous sur de vouloir refuser cette participation ?',
							centered: true,
							okText: 'Refuser',
							okButtonProps: { danger: true },
							icon: (
								<X
									className="participants__decline-modal__icon"
									size={20}
									color="var(--ant-color-error)"
								/>
							),
							onOk: async () =>
								declineParticipants(toDecline)
									.then(async () => {
										const namesToDisplay: Array<string> = []
										let restToDisplay: number = 0

										if (toDecline.length === 1) {
											const user = participants?.find((p) => p.user_id === toDecline[0])?.users

											namesToDisplay.push(getNameFromEmail(user?.email ?? '').name)
										} else if (toDecline.length >= 2) {
											const users = participants?.filter(
												(p) => p.user_id === toDecline[0] || p.user_id === toDecline[1],
											)

											users.forEach((u) => {
												namesToDisplay.push(getNameFromEmail(u.users?.email ?? '').name)
											})

											restToDisplay = toDecline.length - 2
										}

										// TODO: refactor these ternary
										message.success(
											`${
												toDecline.length > 1 ? 'Les participations' : 'La participation'
											} de ${namesToDisplay.join(', ')} ${
												restToDisplay > 0 ? `et ${restToDisplay} autres` : ''
											} ${toDecline.length > 1 ? 'ont été refusées.' : 'a été refusée.'}`,
											7,
										)
										await queryClient.invalidateQueries({
											queryKey: ['event', { id: eventId }, 'participants'],
										})
										await queryClient.refetchQueries({
											queryKey: ['event', { id: eventId }, 'participants'],
										})
									})
									.catch(() => {
										message.error(
											`Impossible de refuser ${
												toDecline.length > 1 ? 'les participants' : 'le participant'
											}. Veuillez réessayer ultérieurement.`,
										)
									}),
						})
					}}
				>
					Refuser
				</Button>
			</Space>
			<Divider />
			<Checkbox.Group
				onChange={setSelectedParticipants}
				value={selectedParticipants}
				options={sortedParticipants.map((p) => ({
					value: p.user_id,
					label: getNameFromEmail(p.users!.email).name,
					disabled: p.approved,
				}))}
			/>
		</>
	)
}

export default Participants
