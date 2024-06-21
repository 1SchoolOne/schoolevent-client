import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import { useAuth } from '@contexts'
import { TReward } from '@types'
import { log, useSupabase } from '@utils'

export function useRewardData() {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['rewards'],
		queryFn: async () => {
			const { data, error } = await supabase.from('rewards').select('*')

			if (error) {
				log.error('Error fetching rewards: ', error)
			}

			return data
		},
	})
}

export function useRewardSelections(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['rewards-selection', { id: userId }],
		queryFn: async () => {
			const { data, error } = await supabase.from('students_reward').select().eq('user_id', userId!)

			if (error) {
				log.error('Error fetching reward selections: ', error)
				throw error
			}

			return data
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

export function useConfirmRewards() {
	const supabase = useSupabase()
	const { user } = useAuth()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (rewardsMap: Map<TReward, number>) => {
			const rewards = Array.from(rewardsMap.entries()).map(([reward, count]) => ({
				quantity: count,
				user_id: user!.id,
				reward_id: reward.id,
			}))

			const { error } = await supabase.from('students_reward').insert(rewards)

			if (error) {
				throw error
			}
		},
		onSuccess: async () => {
			await queryClient.resetQueries({ queryKey: ['rewards'] })
			await queryClient.resetQueries({ queryKey: ['student-points'] })
			message.success('Les récompenses ont été réclamées avec succès.')
		},
		onError: () => {
			message.error('Une erreur est survenue lors de la réclamation des récompenses.')
		},
	})
}
