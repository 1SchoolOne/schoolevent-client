import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/MagnifyingGlass'
import { InputRef, TableProps } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import { ReactNode, RefObject, useMemo, useState } from 'react'

import { getLocalStorage, useDebounce } from '@utils'

import {
	ColumnType,
	IGetRadioOrCheckboxFilterConfigParams,
	IGetStaticRadioOrCheckboxFilterConfigParams,
	ILoadStorageReturn,
	IRenderHeaderParams,
	TFilters,
} from './Table-types'
import { GlobalSearch } from './_components/GlobalSearch/GlobalSearch'
import { RadioOrCheckboxDropdown } from './_components/RadioOrCheckboxDropdown/RadioOrCheckboxDropdown'
import { ResetFiltersButton } from './_components/ResetFiltersButton/ResetFiltersButton'
import { SearchDropdown } from './_components/SearchDropdown/SearchDropdown'

/**
 * Either returns the local storage config corresponding to the `tableId` or initialize the config in the local storage based on the defaultFilters.
 */
export function loadStorage<DataType>(
	tableId: string,
	defaultFilters: TFilters<keyof DataType>,
): ILoadStorageReturn<DataType> {
	const storage = getLocalStorage()

	const tableStorageKey = tableId + '.table'

	if (storage.has(tableStorageKey)) {
		return storage.get(tableStorageKey) as unknown as ILoadStorageReturn<DataType>
	} else {
		const defaultValues = {
			filters: defaultFilters,
			sorter: undefined,
			pagination: { size: 25, offset: 0 },
		}

		storage.set({ key: tableStorageKey, data: defaultValues })

		return defaultValues
	}
}

/**
 * Generates a unique hash based on the input string. Useful to generate React keys.
 *
 * Source: https://stackoverflow.com/a/7616484
 */
export function generateRowKey(str: string) {
	let hash = 0,
		i,
		chr

	if (str.length === 0) return hash

	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}

	return hash
}

/**
 * To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getColumnSearchFilterConfig<DataType extends AnyObject>(
	inputRef: RefObject<InputRef>,
): ColumnType<DataType> {
	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<SearchDropdown
				confirm={confirm}
				clearFilters={clearFilters}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				inputRef={inputRef}
			/>
		),
		filterIcon: <SearchIcon size="16px" />,
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				// We need to delay the focus ever so slightly to make sure the component
				// is rendered when we focus.
				setTimeout(() => {
					inputRef.current?.focus()
				}, 100)
			}
		},
	}
}

/**
 * To be used only when the data source of the table is static. It handles the filtering process.
 */
export function getStaticColumnSearchFilterConfig<DataType extends AnyObject>(
	dataIndex: keyof DataType,
	inputRef: RefObject<InputRef>,
): ColumnType<DataType> {
	const baseConfig = getColumnSearchFilterConfig<DataType>(inputRef)

	return {
		...baseConfig,
		onFilter: (value, record) => {
			const recordValue = record[dataIndex]

			if (typeof value !== 'boolean') {
				return String(recordValue).toLowerCase().includes(String(value).toLowerCase())
			}

			return record[dataIndex] === value
		},
	}
}

/**
 * To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getRadioOrCheckboxFilterConfig<DataType extends AnyObject>(
	params: IGetRadioOrCheckboxFilterConfigParams,
): ColumnType<DataType> {
	const { options, useCheckbox } = params

	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<RadioOrCheckboxDropdown
				useCheckbox={useCheckbox}
				options={options}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				clearFilters={clearFilters}
				confirm={confirm}
			/>
		),
	}
}

/**
 * To be used only when the data source of the table is static. It handles the filtering process.
 */
export function getStaticRadioOrCheckboxFilterConfig<DataType extends AnyObject>(
	params: IGetStaticRadioOrCheckboxFilterConfigParams<DataType>,
): ColumnType<DataType> {
	const { dataIndex, ...restParams } = params
	// We can reuse the getCheckboxFilterProps returned config as they are the same
	const baseConfig = getRadioOrCheckboxFilterConfig<DataType>(restParams)

	return {
		...baseConfig,
		onFilter: (value, record) => record[dataIndex] === value,
	}
}

/**
 * Returns a parsed string to use with `.or()` method from supabase instance base on the filters.
 *
 * @example "school_name.ilike.%filter value%"
 */
export function parseFiltersForSupabase<T>(filters: TFilters<keyof T> | undefined) {
	const queries: Array<string> = []

	if (filters === undefined) {
		return null
	}

	Object.keys(filters).forEach((dataIndex) => {
		const filterValues = filters[dataIndex as keyof T]

		if (filterValues === null) {
			return
		}

		if (filterValues && filterValues.length > 1) {
			const innerQueries: Array<string> = []

			filterValues.forEach((value) => {
				innerQueries.push(`${dataIndex}.ilike.%${value}%`)
			})

			queries.push(`or(${innerQueries.join(',')})`)
		} else {
			queries.push(`${dataIndex}.ilike.%${filterValues![0]}%`)
		}
	})

	return queries.length > 0 ? queries.join(',') : null
}

/**
 * Returns a parsed string to use with `.or()` method from supabase instance base on the global search string and included fields.
 *
 * The global search **MUST** override any filters previously applied.
 * @example "school_name.ilike.%global search value%"
 */
export function parseGlobalSearchForSupabase<T>(globalSearch: string, fields: Array<keyof T>) {
	const queries: Array<string> = []

	fields.forEach((field) => {
		queries.push(`${String(field)}.ilike.%${globalSearch}%`)
	})

	return queries.join(',')
}

/**
 * Calculate the table height based on its parent's height and the table header height, if displayed.
 */
export function useTableHeight(tableRef: RefObject<TableRef>, tableHeader: boolean) {
	const tableHeight = useMemo(() => {
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		// 32 - 16 is the height of the table header minus the bottom margin
		const height = window.innerHeight - top - 55

		return tableHeader ? height - (32 - 16) : height
	}, [tableRef, tableHeader])

	return tableHeight
}

/**
 * @default [25, 50, 75, 100]
 */
export function getPaginationSizeOptions(pagination: TableProps['pagination']) {
	const defaultSizeOptions = [25, 50, 75, 100]

	if (pagination === false) {
		return undefined
	}

	return pagination?.pageSizeOptions ?? defaultSizeOptions
}

/**
 * Formats given number with dots.
 *
 * @example
 * ```js
 * formatNumberWithDots(14500) // will output 14.500
 * ```
 */
export function formatNumberWithDots(numberToFormat: number) {
	return numberToFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function useGlobalSearch(searchedFields?: Array<string>) {
	const [value, setValue] = useState('')
	const debouncedValue = useDebounce(value, 750)

	if (!searchedFields) {
		return { globalSearchInput: null, globalSearchValue: null }
	}

	return {
		globalSearchInput: (
			<GlobalSearch value={value} onChange={setValue} searchedFields={searchedFields} />
		),
		globalSearchValue: debouncedValue,
	}
}

export function useResetFiltersButton(onClick: () => void, enabled?: true) {
	if (!enabled) {
		return null
	}

	return <ResetFiltersButton onClick={onClick} />
}

export function useTableHeader(params: IRenderHeaderParams) {
	const { resetFiltersButton, globalSearchInput, callback } = params

	if (!resetFiltersButton && !globalSearchInput && !callback) {
		return null
	}

	return <div className="se-table-header">{callback(resetFiltersButton, globalSearchInput)}</div>
}

export function defaultRenderHeaderCallback(
	resetFiltersButton?: ReactNode,
	globalSearchInput?: ReactNode,
) {
	return (
		<>
			{globalSearchInput}
			{resetFiltersButton}
		</>
	)
}

export function getScrollX() {
	const layoutContent = document.querySelector('.basic-layout__content') as HTMLDivElement
	const totalWidth = layoutContent.getBoundingClientRect().width
	const { value: padding } = layoutContent.computedStyleMap().get('padding-left') as CSSUnitValue

	return totalWidth - padding
}
