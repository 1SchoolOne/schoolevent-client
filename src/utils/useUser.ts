import { useQuery } from '@tanstack/react-query'

import { IUseUserParams } from '@types'

import { useSupabase } from './useSupabase'

/**
 * Fetch the user data based on its id.
 *
 * Columns fetched: id, email, role, approved.
 * (can be customized)
 */
export function useUser(params: IUseUserParams) {
	const { userId, columns } = params

	const supabase = useSupabase()

	const selectedColumns = columns ? columns.join(',') : undefined

	return useQuery({
		queryKey: ['user', { id: userId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('users')
				.select(selectedColumns)
				.eq('id', userId)
				.single()

			if (error) {
				throw error
			}

			return data
		},
	})
}
