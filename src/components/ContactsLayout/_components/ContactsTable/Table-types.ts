import { InputRef } from 'antd'
import { Dispatch, Key, RefObject } from 'react'

import { Database } from '@types'

export interface IQueryParams {
	limit: number
	offset: number
	select?: string
	where?: string
	orderBy?: string
}

export interface ISchool {
	identifiant_de_l_etablissement: string | null
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

export type TFilteredFields = keyof Pick<
	ISchool,
	'nom_etablissement' | 'type_etablissement' | 'nom_commune' | 'code_postal' | 'adresse_1'
>

export type TFiltersRecord = Record<TFilteredFields, string[] | null>

export type TReducerActionType =
	| TSetDataAction
	| TSetLoadingAction
	| TSetPaginationSizeAction
	| TSetOffsetAction
	| TSetOrderByAction
	| TSetTableHeightAction
	| TSetWhereAction
	| TResetFiltersAction
	| TSetFiltersAction
	| TSetRangeAction
	| TSetUserLocationAction
	| TSetDataMode

export interface IAPIResponse {
	total_count: number
	results: Omit<ISchool, 'favoris'>[]
}

type TDataPayload =
	| {
			total_count: number
			source: 'myContactList'
			data: Database['public']['Tables']['contacts']['Row'][]
	  }
	| {
			total_count: number
			source: 'govApi'
			data: ISchool[]
	  }

type TSetDataAction = {
	type: 'SET_DATA'
	payload: TDataPayload
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
	} | null
}

type TSetTableHeightAction = {
	type: 'SET_TABLE_HEIGHT'
	payload: {
		height: number
	}
}

type TSetWhereAction = {
	type: 'SET_WHERE'
	payload: {
		where: string
	}
}

type TResetFiltersAction = {
	type: 'RESET_FILTERS'
}

type TSetFiltersAction = {
	type: 'SET_FILTERS'
	payload: {
		filters: TFiltersRecord
	}
}

type TSetRangeAction = {
	type: 'SET_RANGE'
	payload: {
		range: number | null
	}
}

type TSetUserLocationAction = {
	type: 'SET_USER_LOCATION'
	payload: {
		location: TUserLocation | undefined
	}
}

type TSetDataMode = {
	type: 'SET_DATA_MODE'
	payload: {
		mode: TTableDataMode
	}
}

export interface IQueryStringBuilderParams {
	range: number | null
	userLocation?: { lat: number; lng: number }
	filters?: TTableFilters
}

export interface ITableConfigState {
	data: ISchool[]
	loading: boolean
	totalCount: number | undefined
	paginationSize: number
	offset: number
	orderBy?: string
	tableHeight: number
	where?: string
	filters: TFiltersRecord
	range: number | null
	userLocation?: TUserLocation
	dataMode: TTableDataMode
}

export interface IGetColumnSearchPropsParams {
	inputRef: RefObject<InputRef>
}

export interface IGetColumnRadioPropsParams {
	options: { label: string; value: Key }[]
}

export type TTableDataMode = 'my_contacts' | 'gov_api'

export type TUserLocation = { lat: number; lng: number }

export type TSetTableConfig = Dispatch<TReducerActionType>
