import { useQuery } from '@tanstack/react-query'

//import { TReward } from '@types'
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

export async function useAddRewardSelection(userId: string | undefined , rewardId: number) {
  const supabase = useSupabase()
  const claimedAt = new Date().toISOString()

  const { data, error } = await supabase
    .from('students_reward')
    .insert([{ user_id: userId!, reward_id: rewardId, quantity: 1, claimed_at: claimedAt }])

  if (error) {
    log.error('Error adding reward selection: ', error)
    throw error
  }

  return data
}

export async function useRemoveRewardSelection(userId: string, rewardId: number) {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from('students_reward')
    .delete()
    .eq('user_id', userId)
    .eq('reward_id', rewardId)

  if (error) {
    log.error('Error removing reward selection: ', error)
    throw error
  }

  return data
}

export function useRewardSelections(userId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['rewards-selection', { id: userId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('students_reward')
				.select('reward_id, quantity')
				.eq('user_id', userId!)

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
