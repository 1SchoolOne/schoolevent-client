import { useQuery } from '@tanstack/react-query'

import { log, useSupabase } from '@utils'


export function useStudentPastEventData(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['student-past-events', { id: userId }],
		queryFn: async () => {
			const { data: participantData, error: participantError } = await supabase
				.from('events_participants')
				.select('event_id, events(*)')
				.eq('user_id', userId!)

			if (participantError) {
				log.error('Error fetching participant data: ', participantError)
				return []
			}
			
			const pastEvents = participantData.map(
				({ events }: any) => events
			)

			return pastEvents
		},
	})
}

export function useStudentPoints(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['student-points', { id: userId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('students')
				.select('points')
				.eq('user_id', userId!)
				.single()

			if (error) {
				throw error
			}

			return data.points
		},
	})
}

export function useHistoricRewardData(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['student-rewards', { id: userId }],
		queryFn: async () => {
			const { data: studentData, error: studentError } = await supabase
				.from('students_reward')
				.select('reward_id, quantity, claimed_at, rewards(*)')
				.eq('user_id', userId!)

			if (studentError) {
				log.error('Error fetching rewards data: ', studentError)
				return []
			}

			const rewardWithQuantities = studentData.map(
				({quantity, claimed_at, rewards}: any) => ({
					...rewards,
					quantity,
					claimed_at
				}) 
			)

			return rewardWithQuantities
		},
	})
}

export function useRewardQuantity(rewardId: number | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['reward-quantity', { id: rewardId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('students_reward')
				.select('quantity')
				.eq('reward_id', rewardId!)
				.single()

			if (error) {
				throw error
			}

			return data.quantity
		},
	})
}

export function useRewardClaimingDate(rewardId: number) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['reward-claimedAt', { id: rewardId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('students_reward')
				.select('claimed_at')
				.eq('reward_id', rewardId!)
				.single()

			if (error) {
				throw error
			}
			
			if (!data || !data.claimed_at) {
				return 'Date inconnue'
			}

			return data.claimed_at
		},
	})
}
