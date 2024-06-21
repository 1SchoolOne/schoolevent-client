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
