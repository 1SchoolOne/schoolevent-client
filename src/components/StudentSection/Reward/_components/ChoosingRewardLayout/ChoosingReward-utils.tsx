import { TReward } from '@types'
import { log, useSupabase } from '@utils'

export const useFetchRewardData = async (): Promise<TReward[]> => {
	const supabase = useSupabase()

	const { data, error } = await supabase.from('rewards').select('*')

	if (error) {
		log.error('Error fetching rewards: ', error)
		return []
	}

	return data
}

export const useAddRewardSelection = async (userId: string, rewardId: number) => {
	const supabase = useSupabase()

	const claimedAt = new Date().toISOString()

	const { data, error } = await supabase
		.from('students_reward')
		.insert([{ user_id: userId, reward_id: rewardId, quantity: 1, claimed_at: claimedAt }])

	if (error) {
		log.error('Error adding reward selection: ', error)
		throw error
	}

	return data
}

export const useRemoveRewardSelection = async (userId: string, rewardId: number) => {
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

export const useFetchRewardSelections = async (userId: string) => {
	const supabase = useSupabase()

	const { data, error } = await supabase
		.from('reward_selections')
		.select('reward_id, quantity')
		.eq('user_id', userId)

	if (error) {
		log.error('Error fetching reward selections: ', error)
		throw error
	}

	return data
}
