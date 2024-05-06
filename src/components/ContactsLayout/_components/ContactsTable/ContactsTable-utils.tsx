import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Button, Grid, InputRef } from 'antd'
import { SortOrder } from 'antd/lib/table/interface'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo, useRef } from 'react'

import {
	ColumnsType,
	getColumnSearchFilterConfig,
	getRadioOrCheckboxFilterConfig,
} from '@components'
import { useAuth, useFavorites } from '@contexts'
import { Database, ITableStorage } from '@types'
import { getLocalStorage, isStringEmpty } from '@utils'

import { IGeoLocationState } from '../../../ContactsMap/ContactsMap-types'
import { ISorter, TFilterValue, TFilters } from '../../../Table/Table-types'
import {
	DEFAULT_ETABLISSEMENT_FILTER,
	DEFAULT_FILTER_OBJECT,
	GOUV_API_URL,
} from './ContactsTable-constants'
import { IQueryParams, ISchool, ITableConfigState, TReducerActionType } from './ContactsTable-types'

dayjs.extend(utc)
dayjs.extend(timezone)

const { useBreakpoint } = Grid

export function fetchTableData(queryParams: IQueryParams) {
	const { limit, offset, select, where, orderBy } = queryParams

	const selectQuery = select ? `&select=${select}` : ''
	const whereQuery = where ? `&where=${encodeURIComponent(where)}` : ''
	const orderByQuery = orderBy ? `&order_by=${orderBy}` : ''

	const url = `${GOUV_API_URL}?timezone=Europe%2FParis&limit=${limit}&offset=${offset}${selectQuery}${whereQuery}${orderByQuery}`

	return fetch(url)
}

export function reducer(state: ITableConfigState, action: TReducerActionType): ITableConfigState {
	const localStorage = getLocalStorage()
	const tableStorage = localStorage.get('contacts.table') as ITableStorage

	switch (action.type) {
		case 'SET_DATA':
			return {
				...state,
				data:
					action.payload.source === 'myContactList'
						? parseContactList(action.payload.data)
						: action.payload.data,
				totalCount: action.payload.total_count,
			}
		case 'SET_LOADING':
			return {
				...state,
				loading: action.payload.loading,
			}
		case 'SET_PAGINATION_SIZE':
			localStorage.set({
				key: 'contacts.table',
				data: {
					...tableStorage,
					paginationSize: action.payload.paginationSize,
				},
			})

			return {
				...state,
				paginationSize: action.payload.paginationSize,
			}
		case 'SET_OFFSET':
			return {
				...state,
				offset: action.payload.offset,
			}
		case 'SET_ORDER_BY':
			if (action.payload === null) {
				localStorage.set({
					key: 'contacts.table',
					data: {
						...tableStorage,
						orderBy: null,
					},
				})

				return {
					...state,
					orderBy: undefined,
				}
			}

			localStorage.set({
				key: 'contacts.table',
				data: {
					...tableStorage,
					orderBy: `${action.payload.field} ${action.payload.order}`,
				},
			})

			return {
				...state,
				orderBy: `${action.payload.field} ${action.payload.order}`,
			}
		case 'SET_TABLE_HEIGHT':
			return {
				...state,
				tableHeight: action.payload.height,
			}
		case 'SET_WHERE':
			return {
				...state,
				where: action.payload.where,
			}
		case 'RESET_FILTERS':
			return {
				...state,
				orderBy: 'nom_etablissement ASC',
				where: DEFAULT_ETABLISSEMENT_FILTER,
				filters: DEFAULT_FILTER_OBJECT,
			}
		case 'SET_FILTERS':
			return {
				...state,
				filters: action.payload.filters,
			}
		case 'SET_RANGE':
			return {
				...state,
				range: action.payload.range,
			}
		case 'SET_USER_LOCATION':
			return {
				...state,
				userLocation: action.payload.location,
			}
		case 'SET_DATA_MODE':
			return {
				...state,
				dataMode: action.payload.mode,
			}
	}
}

/**
 * Get the sort order of a column from the orderBy string
 */
export function getSortOrder(
	index: keyof ISchool,
	orderBy: string | undefined,
): SortOrder | undefined {
	if (!orderBy || orderBy === '') {
		return undefined
	}

	const field = orderBy.split(' ')[0]
	const order = orderBy.split(' ')[1]

	if (field === index) {
		return order === 'ASC' ? 'ascend' : 'descend'
	}

	return undefined
}

export function useColumns() {
	const { user } = useAuth()
	const { addFavorite, removeFavorite, doesFavoriteExist } = useFavorites()
	const screens = useBreakpoint()
	const inputRef = useRef<InputRef>(null)

	const handleFavorites = async (record: ISchool) => {
		if (user) {
			const exists = await doesFavoriteExist(record.identifiant_de_l_etablissement!, user.id)

			if (exists) {
				removeFavorite(record.identifiant_de_l_etablissement!)
			} else {
				addFavorite({
					school_id: record.identifiant_de_l_etablissement!,
					school_name: record.nom_etablissement,
					school_city: record.nom_commune,
					school_postal_code: record.code_postal,
					created_at: dayjs().tz().toISOString(),
				})
			}
		}
	}

	const columns = useMemo<ColumnsType<ISchool>>(
		() => [
			{
				key: 'nom_etablissement',
				title: 'Établissement',
				dataIndex: 'nom_etablissement',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'type_etablissement',
				title: 'Type',
				dataIndex: 'type_etablissement',
				width: screens.xxl ? 110 : 90,
				...getRadioOrCheckboxFilterConfig({
					options: [
						{ label: 'Collège', value: 'Collège' },
						{ label: 'Lycée', value: 'Lycée' },
					],
				}),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'nom_commune',
				title: 'Commune',
				dataIndex: 'nom_commune',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'code_postal',
				title: 'Code postal',
				dataIndex: 'code_postal',
				width: screens.xxl ? 160 : 140,
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'adresse_1',
				title: 'Adresse',
				dataIndex: 'adresse_1',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'favoris',
				title: 'Favoris',
				dataIndex: 'favoris',
				width: screens.xxl ? 100 : 75,
				fixed: 'right',
				render: (value, record) => {
					return (
						<Button
							className="favorite-button"
							onClick={async () => {
								await handleFavorites(record)
							}}
							icon={<FavoriteIcon size="1rem" weight={value ? 'fill' : 'regular'} />}
							type="text"
						/>
					)
				},
			},
		],
		[screens.xxl, handleFavorites],
	)

	return columns
}

/**
 * This class is a utility class for building SQL WHERE clauses.
 */
export class QueryStringBuilder<T> {
	private filters: TFilters<keyof T> | undefined

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

function parseContactList(
	contactList: Array<Database['public']['Tables']['contacts']['Row']>,
): Array<ISchool> {
	return contactList.map((c) => ({
		identifiant_de_l_etablissement: '',
		nom_etablissement: c.school_name,
		adresse_1: c.address ?? '',
		code_postal: c.postal_code,
		nom_commune: c.city,
		type_etablissement: c.school_type,
		mail: c.mail ?? '',
		telephone: c.telephone ?? '',
		latitude: c.latitude ? Number(c.latitude) : 0,
		longitude: c.longitude ? Number(c.longitude) : 0,
		favoris: false,
	}))
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

	// If a range is provided, we query only the schools that are within that range.
	// Otherwise, we use the previous where clause.
	return range
		? `${where} AND distance(position, geom'POINT(${userLocation?.lng} ${userLocation?.lat})', ${range}km)`
		: where
}
