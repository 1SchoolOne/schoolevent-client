import { useQuery } from '@tanstack/react-query'

import { useSupabase } from './useSupabase'

export function useEvent(eventId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['event', { id: eventId }],
		queryFn: async () => {
			const { data, error } = await supabase.from('events').select().eq('id', eventId!).single()

			if (error) {
				throw error
			}

			return data
		},
		enabled: !!eventId,
	})
}
