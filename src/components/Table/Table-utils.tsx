import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/MagnifyingGlass'
import { InputRef, TableProps } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import { RefObject, useMemo, useRef } from 'react'

import { getLocalStorage } from '@utils'

import {
	ColumnType,
	IGetRadioOrCheckboxFilterConfigParams,
	IGetStaticRadioOrCheckboxFilterConfigParams,
	ILoadStorageReturn,
	TFilters,
} from './Table-types'
import { RadioOrCheckboxDropdown } from './_components/RadioOrCheckboxDropdown/RadioOrCheckboxDropdown'
import { SearchDropdown } from './_components/SearchDropdown/SearchDropdown'

export function loadStorage<DataType>(tableId: string): ILoadStorageReturn<DataType> {
	const storage = getLocalStorage()

	const tableStorageKey = tableId + '.table'

	if (storage.has(tableStorageKey)) {
		return storage.get(tableStorageKey) as unknown as ILoadStorageReturn<DataType>
	} else {
		const defaultValues = {
			filters: undefined,
			sorter: undefined,
			pagination: { size: 25, offset: 0 },
		}

		storage.set({ key: tableStorageKey, data: defaultValues })

		return defaultValues
	}
}

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
export function useGetColumnSearchFilterConfig<DataType extends AnyObject>(): ColumnType<DataType> {
	const inputRef = useRef<InputRef>(null)

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

export function useGetStaticColumnSearchFilterConfig<DataType extends AnyObject>(
	dataIndex: keyof DataType,
): ColumnType<DataType> {
	const baseConfig = useGetColumnSearchFilterConfig<DataType>()

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

export function parseFiltersForSupabase(filters: TFilters | undefined) {
	const queries: Array<string> = []

	if (filters === undefined) {
		return null
	}

	Object.keys(filters).forEach((dataIndex) => {
		const filterValues = filters[dataIndex]

		if (filterValues === null) {
			return
		}

		if (filterValues.length > 1) {
			const innerQueries: Array<string> = []

			filterValues.forEach((value) => {
				innerQueries.push(`${dataIndex}.ilike.%${value}%`)
			})

			queries.push(`or(${innerQueries.join(',')})`)
		} else {
			queries.push(`${dataIndex}.ilike.%${filterValues[0]}%`)
		}
	})

	return queries.length > 0 ? queries.join(',') : null
}

export function useTableHeight(tableRef: RefObject<TableRef>) {
	const tableHeight = useMemo(() => {
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		const height = window.innerHeight - top - 55

		return height
	}, [tableRef])

	return tableHeight
}

export function getPaginationSizeOptions(pagination: TableProps['pagination']) {
	const defaultSizeOptions = [25, 50, 75, 100]

	if (pagination === false) {
		return undefined
	}

	return pagination?.pageSizeOptions ?? defaultSizeOptions
}
