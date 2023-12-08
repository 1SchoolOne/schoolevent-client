import { GOUV_API_URL } from './Table-constants'
import { IQueryParams, ITableConfigState, TReducerActionType } from './Table-types'

export function fetchTableData(queryParams: IQueryParams) {
	const { limit, offset, select, where, orderBy } = queryParams

	const selectQuery = select ? `&select=${select}` : ''
	const whereQuery = where ? `&where=${where}` : ''
	const orderByQuery = orderBy ? `&order_by=${orderBy}` : ''

	const url = `${GOUV_API_URL}?timezone=Europe%2FParis&limit=${limit}&offset=${offset}${selectQuery}${whereQuery}${orderByQuery}`

	return fetch(url)
}

export function reducer(state: ITableConfigState, action: TReducerActionType): ITableConfigState {
	switch (action.type) {
		case 'SET_DATA':
			return {
				...state,
				data: action.payload.data.results,
				totalCount: action.payload.data.total_count,
			}
		case 'SET_LOADING':
			return {
				...state,
				loading: action.payload.loading,
			}
		case 'SET_PAGINATION_SIZE':
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
			return {
				...state,
				orderBy: `${action.payload.field} ${action.payload.order}`,
			}
		case 'SET_TABLE_HEIGHT':
			return {
				...state,
				tableHeight: action.payload.height,
			}
	}
}
