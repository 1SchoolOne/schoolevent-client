import { useQuery } from '@tanstack/react-query'

import { log, useSupabase } from '@utils'

export function useStudentPastEventData(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['student-past-events', { id: userId }],
		queryFn: async () => {
			const { data: participantData, error: participantError } = await supabase
				.from('events_participants')
				.select('event_id')
				.eq('user_id', userId!)

			if (participantError) {
				log.error('Error fetching participant data: ', participantError)
				return []
			}
			const eventIds = participantData.map(
				(participant: { event_id: number }) => participant.event_id,
			)

			const { data: eventsData, error: eventsError } = await supabase
				.from('events')
				.select('*')
				.in('id', eventIds)
				.lt('event_date', new Date().toISOString())

			if (eventsError) {
				log.error('Error fetching past events: ', eventsError)
				return []
			}

			return eventsData
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
			.select('reward_id, quantity')
			.eq('user_id', userId!)

			if (studentError) {
				log.error('Error fetching rewards data: ', studentError)
				return []
			}
			const rewardIds = studentData.map(
				(reward: { reward_id: number }) => reward.reward_id,
			)

			const { data: rewardsData, error: rewardsError } = await supabase
			.from('rewards')
			.select()
			.in('id', rewardIds)

			if(rewardsError) {
				log.error('Error fetching students rewards: ', rewardsError)
				return []
			}

			const rewardQuantities = studentData.reduce((acc: { [key: number]: number }, {reward_id, quantity}) => {
				acc[reward_id] = quantity
				return acc
			}, {})

			const rewardWithQuantities = rewardsData.map((reward: any) => ({
				...reward,
				quantity: rewardQuantities[reward.id] || 0,
			}))

			return rewardWithQuantities
		}
	})
}
