import { IAddFavoriteParams, IDeleteFavoriteParams } from './FavoriteContacts-types'

export async function addFavorite(params: IAddFavoriteParams) {
	const { supabase, favorite, userId } = params

	if (userId === undefined) {
		throw new Error('userId is undefined')
	}

	return supabase.from('favorites').insert({
		...favorite,
		user_id: userId,
	})
}

export async function removeFavorite(params: IDeleteFavoriteParams) {
	const { supabase, recordId, userId } = params

	if (userId === undefined) {
		throw new Error('userId is undefined')
	}

	if (typeof recordId === 'string') {
		return supabase.from('favorites').delete().eq('school_id', recordId)
	}

	return supabase.from('favorites').delete().eq('contact_id', recordId)
}
