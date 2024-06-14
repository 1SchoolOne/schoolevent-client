import { useQuery } from '@tanstack/react-query'

import { useSupabase } from './useSupabase'

export function useAssignees() {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['assignees'],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('users')
				.select('user_id,email')
				.in('role', ['manager', 'admin'])

			if (error) {
				throw error
			}

			return data
		},
	})
}
