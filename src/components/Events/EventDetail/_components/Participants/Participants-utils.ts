import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message as Message } from 'antd'
import { useEffect, useState } from 'react'

import { getNameFromEmail, log, useSupabase } from '@utils'

const { useMessage } = Message

export function useController(eventId: string | undefined) {
	const supabase = useSupabase()
	const [selectedParticipants, setSelectedParticipants] = useState<Array<string>>([])
	const queryClient = useQueryClient()
	const [message] = useMessage()

	const { data: participants } = useQuery({
		queryKey: ['event', { id: eventId }, 'participants'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('events_participants')
				.select(
					`
					*,
					users(id,email)
				`,
				)
				.eq('event_id', eventId!)

			if (error) {
				throw error
			}

			return data
		},
		staleTime: 15_000,
	})

	useEffect(() => {
		if (participants) {
			setSelectedParticipants(participants.filter((p) => p.approved).map((p) => p.user_id))
		}
	}, [participants])

	const { mutate: approveParticipants } = useMutation({
		mutationFn: async (
			toApprove: Array<{
				id: number
				event_id: number
				user_id: string
				approved: boolean
			}>,
		) => {
			const { error } = await supabase.from('events_participants').upsert(toApprove)

			if (error) {
				log.error(error)
				throw error
			}

			return toApprove
		},
		onSuccess: async (toApprove) => {
			const namesToDisplay: Array<string> = []
			let restToDisplay: number = 0

			if (toApprove.length === 1) {
				const user = participants?.find((p) => p.user_id === toApprove[0].user_id)?.users

				namesToDisplay.push(getNameFromEmail(user?.email ?? '').name)
			} else if (toApprove.length >= 2) {
				const users =
					participants?.filter(
						(p) => p.user_id === toApprove[0].user_id || p.user_id === toApprove[1].user_id,
					) ?? []

				users.forEach((u) => {
					namesToDisplay.push(getNameFromEmail(u.users?.email ?? '').name)
				})

				restToDisplay = toApprove.length - 2
			}

			// TODO: refactor these ternary
			message.success(
				`${
					toApprove.length > 1 ? 'Les participations' : 'La participation'
				} de ${namesToDisplay.join(', ')} ${
					restToDisplay > 0 ? `et ${restToDisplay} autres` : ''
				} ${toApprove.length > 1 ? 'ont été acceptées.' : 'a été acceptée.'}`,
				7,
			)

			await queryClient.invalidateQueries({ queryKey: ['event', { id: eventId }, 'participants'] })
			await queryClient.refetchQueries({ queryKey: ['event', { id: eventId }, 'participants'] })
		},
	})

	const declineParticipants = async (toDecline: Array<string>) => {
		if (!eventId) {
			throw new Error(
				'Impossible de décliner les participants. `eventId` = `' + String(eventId) + '`',
			)
		}
		const { error } = await supabase
			.from('events_participants')
			.delete()
			.eq('event_id', eventId)
			.in('user_id', toDecline)

		if (error) {
			log.error(error)
			throw error
		}
	}

	return {
		participants,
		selectedParticipants,
		setSelectedParticipants,
		approveParticipants,
		declineParticipants,
	}
}
