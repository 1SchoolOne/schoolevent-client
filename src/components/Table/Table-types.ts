import { TableProps } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import {
	ColumnGroupType as AntdColumnGroupType,
	ColumnType as AntdColumnType,
} from 'antd/lib/table'
import { FilterValue, SortOrder } from 'antd/lib/table/interface'
import { ReactNode } from 'react'

/**
 * By default, antd's ColumnsType won't autocomplete the `dataIndex` property based on the `DataType`
 * keys. By omitting `dataIndex` and typing it as a `key of T` it allows to autocomplete.
 */
type AutoCompleteColumnType<T extends AnyObject> = Omit<AntdColumnType<T>, 'dataIndex'> & {
	dataIndex?: Extract<keyof T, string>
}

type AutoCompleteColumnGroupType<T extends AnyObject> = Omit<
	AntdColumnGroupType<T>,
	'dataIndex'
> & {
	dataIndex: Extract<keyof T, string>
}

export type ColumnType<T extends AnyObject> =
	| AutoCompleteColumnGroupType<T>
	| AutoCompleteColumnType<T>

export type ColumnsType<T extends AnyObject> = ColumnType<T>[]

export interface ITableProps<T extends AnyObject>
	extends Omit<TableProps<T>, 'dataSource' | 'columns' | 'onChange'> {
	tableId: string
	dataSource: TDataSource<T>
	columns: ColumnsType<T>
	renderHeader?: TRenderHeader
	globalSearch?: {
		/**
		 * List of fields that are included in the global search. They will be
		 * displayed in the global search tooltip. This list is only used for display
		 * purposes.
		 */
		searchedFields: Array<string>
	}
	showResetFilters?: true
	/**
	 * Values **MUST** be null, not undefined.
	 */
	defaultFilters: TFilters<keyof T, null>
}

export type TDataSource<T> =
	| IDataSourceObject<T>
	| ((
			filters: TFilters<keyof T> | undefined,
			sorter: ISorter<T> | undefined,
			pagination: IPagination | undefined,
			globalSearch: string | null,
	  ) => Promise<IDataSourceObject<T>>)

export interface IDataSourceObject<T> {
	data: Array<T>
	totalCount: number
}

export type TOption = {
	label: string
	value: CheckboxValueType
}

export interface IGetRadioOrCheckboxFilterConfigParams {
	options: TOption[]
	useCheckbox?: true
}

export interface IGetStaticRadioOrCheckboxFilterConfigParams<T extends AnyObject>
	extends IGetRadioOrCheckboxFilterConfigParams {
	dataIndex: keyof T
}

export type TFilters<K extends string | number | symbol, V = TFilterValue> = Partial<Record<K, V>>

export type TFilterValue = FilterValue | null | undefined

export interface ISorter<T> {
	field: keyof T
	order: SortOrder
}

export interface IPagination {
	size: number
	offset: number
}

export interface ITableConfig<T> {
	filters: TFilters<keyof T> | undefined
	sorter: ISorter<T> | undefined
	pagination: IPagination | undefined
}

export interface ILoadStorageReturn<T> extends ITableConfig<T> {}

export type TRenderHeader = (
	resetFiltersButton?: ReactNode,
	globalSearchInput?: ReactNode,
) => ReactNode

export interface IRenderHeaderParams {
	resetFiltersButton: JSX.Element | null
	globalSearchInput: JSX.Element | null
	callback: TRenderHeader
}