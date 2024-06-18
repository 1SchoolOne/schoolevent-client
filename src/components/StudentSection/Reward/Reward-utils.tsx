import { TEvent } from '@types'
import { log, useSupabase } from '@utils'

export const useFetchStudentPastEventData = async (userId: string): Promise<TEvent[]> => {
	const supabase = useSupabase()

	const {data: participantData, error: participantError} = await supabase
  .from('events_participants')
  .select('event_id')
  .eq('user_id', userId)

  if(participantError) {
    log.error('Error fetching participant data: ', participantError)
    return []
  }
  
  const eventIds = participantData.map((participant: {event_id: number}) => participant.event_id)
  
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
}
