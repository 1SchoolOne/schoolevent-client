export interface IQueryParams {
	limit: number
	offset: number
	select?: string
	where?: string
	orderBy?: string
}

export interface ISchool {
	identifiant_de_l_etablissement: string
	nom_etablissement: string
	type_etablissement: string
	adresse_1: string
	code_postal: string
	nom_commune: string
	latitude: string
	longitude: string
	mail: string
	telephone: string
}

export type TReducerActionType =
	| TSetDataAction
	| TSetLoadingAction
	| TSetPaginationSizeAction
	| TSetOffsetAction
	| TSetOrderByAction

interface IAPIResponse {
	total_count: number
	results: ISchool[]
}

type TSetDataAction = {
	type: 'SET_DATA'
	payload: {
		data: IAPIResponse
	}
}

type TSetLoadingAction = {
	type: 'SET_LOADING'
	payload: {
		loading: boolean
	}
}

type TSetPaginationSizeAction = {
	type: 'SET_PAGINATION_SIZE'
	payload: {
		paginationSize: number
	}
}

type TSetOffsetAction = {
	type: 'SET_OFFSET'
	payload: {
		offset: number
	}
}

type TSetOrderByAction = {
	type: 'SET_ORDER_BY'
	payload: {
		field: keyof ISchool
		order: 'ASC' | 'DESC'
	}
}

export interface ITableConfigState {
	data: ISchool[]
	loading: boolean
	totalCount: number
	paginationSize: number
	offset: number
	orderBy?: string
}
