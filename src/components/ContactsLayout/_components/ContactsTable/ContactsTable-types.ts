import { IPagination, ISorter, TFilters } from '@components'
import { TSupabase } from '@types'

import { TFavorite } from '../../../../contexts/FavoriteContacts/FavoriteContacts-types'
import { IGeoLocationState } from '../../../ContactsMap/ContactsMap-types'

export interface IQueryParams {
	limit: number
	offset: number
	select?: string
	where?: string
	orderBy?: string
}

export interface ISchool {
	identifiant_de_l_etablissement: string | number | null
	nom_etablissement: string
	type_etablissement: string
	adresse_1: string
	code_postal: string
	nom_commune: string
	latitude: number | null
	longitude: number | null
	mail: string | null
	telephone: string | null
	favoris: boolean
}

export interface IAPIResponse {
	total_count: number
	results: Omit<ISchool, 'favoris'>[]
}

export interface IFetchMyContactsParams<T> {
	supabase: TSupabase
	userId: string
	filters: TFilters<keyof T> | undefined
	sorter: ISorter<T> | undefined
	pagination: IPagination | undefined
	globalSearch: string | null
	favorites: Array<TFavorite>
}

export interface IFetchGovContactsParams<T>
	extends Omit<IFetchMyContactsParams<T>, 'userId' | 'supabase'> {
	location: IGeoLocationState
}
