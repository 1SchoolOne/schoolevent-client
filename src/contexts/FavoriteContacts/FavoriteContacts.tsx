import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useMemo } from 'react'

import { useAuth } from '@contexts'
import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IFavoriteContactsContext, TFavorite } from './FavoriteContacts-types'
import { addFavorite, removeFavorite } from './FavoriteContacts-utils'

const FavoriteContactsContext = createContext<IFavoriteContactsContext>(
	{} as IFavoriteContactsContext,
)

export function FavoriteContactsProvider({ children }: PropsWithChildren) {
	const { user } = useAuth()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	const {
		data: favorites,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['favorites', { userId: user?.id }],
		queryFn: async () => {
			if (!user) {
				throw new Error('user.id is undefined')
			}

			const { data, error } = await supabase.from('favorites').select('*').eq('user_id', user.id)

			if (error) {
				console.log(error)
				throw error
			}

			return data
		},
		placeholderData: [],
		enabled: !!user,
	})

	const addFav = useMutation({
		mutationFn: async (favorite: Omit<TFavorite, 'id' | 'user_id'>) =>
			await addFavorite({ favorite, supabase, userId: user?.id }),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['favorites', { userId: user?.id }] })
		},
	})

	const deleteFav = useMutation({
		mutationFn: async (school_id: string) =>
			await removeFavorite({ school_id, supabase, userId: user?.id }),
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['favorites', { userId: user?.id }] })
		},
	})

	/**
	 * Verifies if a favorite exists in the database.
	 * Returns true if it exists, false otherwise.
	 */
	const doesFavoriteExist = useCallback(
		async (school_id: string, userId: string) => {
			const { data } = await supabase
				.from('favorites')
				.select('*')
				.eq('user_id', userId)
				.eq('school_id', school_id)

			return !!(data && data?.length > 0)
		},
		[supabase],
	)

	const value: IFavoriteContactsContext = useMemo(
		() => ({
			favorites: favorites ?? [],
			loading: isLoading,
			addFavorite: addFav.mutate,
			removeFavorite: deleteFav.mutate,
			doesFavoriteExist,
			refresh: refetch,
		}),
		[favorites, isLoading, addFav.mutate, deleteFav.mutate, doesFavoriteExist, refetch],
	)

	return (
		<FavoriteContactsContext.Provider value={value}>{children}</FavoriteContactsContext.Provider>
	)
}

export function useFavorites() {
	return useContext(FavoriteContactsContext)
}
