import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

import { ISorter, TFilterValue, TFilters } from '@components'
import { getLocalStorage, isStringEmpty } from '@utils'

import { IGeoLocationState } from '../../../ContactsMap/ContactsMap-types'
import { DEFAULT_ETABLISSEMENT_FILTER, GOUV_API_URL } from './ContactsTable-constants'
import { IQueryParams, TRange } from './ContactsTable-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function fetchGovData(queryParams: IQueryParams) {
	const { limit, offset, select, where, orderBy } = queryParams

	const selectQuery = select ? `&select=${select}` : ''
	const whereQuery = where ? `&where=${encodeURIComponent(where)}` : ''
	const orderByQuery = orderBy ? `&order_by=${orderBy}` : ''

	const url = `${GOUV_API_URL}?timezone=Europe%2FParis&limit=${limit}&offset=${offset}${selectQuery}${whereQuery}${orderByQuery}`

	return fetch(url)
}

/**
 * This class is a utility class for building SQL WHERE clauses.
 */
export class QueryStringBuilder<T> {
	private readonly filters: TFilters<keyof T> | undefined

	constructor(filters?: TFilters<keyof T>) {
		this.filters = filters
	}

	/**
	 * Returns the SQL WHERE clause as a string.
	 */
	public build(): string {
		if (!this.filters) {
			return DEFAULT_ETABLISSEMENT_FILTER
		}

		const where: string[] = []

		for (const [key, value] of Object.entries(this.filters)) {
			const val = value as TFilterValue

			if (key === 'type_etablissement') {
				if (val) {
					where.push(`type_etablissement = '${val}'`)
				} else {
					where.push(DEFAULT_ETABLISSEMENT_FILTER)
				}

				continue
			}

			if (!val || val.length === 0) {
				continue
			}

			if (val.length === 1) {
				where.push(`search(${key}, '${val[0]}')`)
			} else {
				where.push(`${key} IN ('${val.join('","')}')`)
			}
		}

		return where.join(' AND ')
	}

	/**
	 * Returns true if the builder is empty, false otherwise.
	 */
	public isEmpty(): boolean {
		return !this.filters || Object.entries(this.filters).length === 0
	}
}

export function getGlobalSearch(globalSearch: string): string | null {
	if (isStringEmpty(globalSearch)) {
		return null
	}

	return `search(nom_etablissement, "${globalSearch}") OR search(nom_commune, "${globalSearch}") OR search(code_postal, "${globalSearch}") OR search(adresse_1, "${globalSearch}")`
}

export function getRowClassname(index: number, theme: 'light' | 'dark'): string {
	if (index % 2 === 0) {
		return `even-row even-row__${theme}`
	} else {
		return `odd-row odd-row__${theme}`
	}
}

export function getOrderBy<DataType>(sorter: ISorter<DataType> | undefined) {
	if (!sorter?.order) {
		return undefined
	}

	return `${String(sorter.field)} ${sorter.order === 'descend' ? 'DESC' : 'ASC'}`
}

export function getWhere<T>(
	filters: TFilters<keyof T> | undefined,
	gblSearch: string | null,
	range: number | null,
	location: IGeoLocationState,
) {
	const { geoLocationCoordinates: userLocation } = location

	const queryStringBuilder = new QueryStringBuilder(filters)
	const baseQueryString = queryStringBuilder.build()

	// If the global search is set, we use it as the where clause.
	// Otherwise, we use the base query string.
	const where = gblSearch ? `${DEFAULT_ETABLISSEMENT_FILTER} AND (${gblSearch})` : baseQueryString

	if (range && location.loaded && location.error === null) {
		// If a range is provided, we query only the schools that are within that range.
		return `${where} AND distance(position, geom'POINT(${userLocation?.lng} ${userLocation?.lat})', ${range}km)`
	}

	// Otherwise, we use the previous where clause.
	return where
}

export function loadRange(location: IGeoLocationState): TRange {
	const storage = getLocalStorage()

	const storageKey = 'gov-contacts.table.range'

	if (!location.loaded || location.error) {
		return null
	}

	if (storage.has(storageKey)) {
		return storage.get(storageKey) as TRange
	} else {
		storage.set({ key: storageKey, data: null })
		return null
	}
}
