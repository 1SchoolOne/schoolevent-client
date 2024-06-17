import { TReward } from "@types"
import { log, useSupabase } from '@utils'

export const useFetchRewardData = async(): Promise<TReward[]> => { 
  const supabase = useSupabase()

  const { data, error } = await supabase.from('rewards').select('*')

  if (error) {
    log.error('Error fetching rewards: ', error)
    return []
  }

  return data
}