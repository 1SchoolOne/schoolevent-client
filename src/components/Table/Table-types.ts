import { TableProps } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import {
	ColumnGroupType as AntdColumnGroupType,
	ColumnType as AntdColumnType,
} from 'antd/lib/table'
import { FilterValue, SortOrder } from 'antd/lib/table/interface'

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
}

export type TDataSource<T> =
	| IDataSourceObject<T>
	| ((
			filters: TFilters | undefined,
			sorter: ISorter<T> | undefined,
			pagination: IPagination | undefined,
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

export type TFilters = Record<string, FilterValue | null>

export interface ISorter<T> {
	field: keyof T
	order: SortOrder
}

export interface IPagination {
	size: number
	offset: number
}

export interface ITableConfig<T> {
	filters: TFilters | undefined
	sorter: ISorter<T> | undefined
	pagination: IPagination | undefined
}

export interface ILoadStorageReturn<T> extends ITableConfig<T> {}
