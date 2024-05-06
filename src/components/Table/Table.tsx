import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Table as AntdTable, Grid } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import classNames from 'classnames'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { useLocalStorage } from '@utils'

import { ITableConfig, ITableProps, TFilters } from './Table-types'
import {
	defaultRenderHeaderCallback,
	formatNumberWithDots,
	generateRowKey,
	getPaginationSizeOptions,
	loadStorage,
	useGlobalSearch,
	useResetFiltersButton,
	useTableHeader,
	useTableHeight,
} from './Table-utils'
import { LoadingTable } from './_components/LoadingTable/LoadingTable'

import './Table-styles.less'

const { useBreakpoint } = Grid

function InnerTable<DataType extends AnyObject>(props: ITableProps<DataType>) {
	const {
		tableId,
		dataSource,
		columns,
		pagination,
		className,
		renderHeader = defaultRenderHeaderCallback,
		showResetFilters,
		globalSearch,
		defaultFilters,
		...restProps
	} = props
	const [tableConfig, setTableConfig] = useState<ITableConfig<DataType>>(
		loadStorage<DataType>(tableId, defaultFilters),
	)
  const queryClient = useQueryClient()
	const tableRef = useRef<TableRef>(null)
	const storage = useLocalStorage()
	const screens = useBreakpoint()
	const resetFiltersButton = useResetFiltersButton(() => {
		setTableConfig((prevConfig) => ({
			...prevConfig,
			filters: defaultFilters,
			sorter: undefined,
		}))
	}, showResetFilters)
	const { globalSearchInput, globalSearchValue } = useGlobalSearch(globalSearch?.searchedFields)
	const tableHeight = useTableHeight(tableRef, !!resetFiltersButton && !!globalSearchInput)
	const tableHeader = useTableHeader({
		resetFiltersButton,
		globalSearchInput,
		callback: renderHeader,
	})

	const tableStorageKey = `${tableId}.table`

	const paginationOptions = useMemo(() => getPaginationSizeOptions(pagination), [pagination])

	const { data: tableData } = useSuspenseQuery({
		queryKey: [
			tableId,
		],
		queryFn: async () => {
			if (typeof dataSource !== 'function') {
				return dataSource
			}

			return await dataSource(
				tableConfig.filters,
				tableConfig.sorter,
				tableConfig.pagination,
				globalSearchValue,
			)
		},
	})

  useEffect(function refetchQuery() {
    queryClient.refetchQueries({
      queryKey: [tableId]
    })
  }, [tableConfig, globalSearchValue])

	const cols: typeof columns = useMemo(
		() =>
			columns.map((col) => ({
				...col,
				key: col.dataIndex,
				width: col.width ?? 200,
				filteredValue: tableConfig.filters?.[col.dataIndex as string],
				sortOrder:
					tableConfig.sorter?.field === col.dataIndex ? tableConfig.sorter?.order : undefined,
			})),
		[tableConfig.filters, tableConfig.sorter, columns],
	)

  // Calculate the width of the table body with columns width.
  // It makes the table scrollable horizontally.
	let scrollX = 0

	cols.forEach((col) => {
		scrollX += Number(col.width)
	})

	useEffect(function syncLocalStorage() {
		storage.set({ key: tableStorageKey, data: tableConfig as unknown as Record<string, unknown> })
	}, [storage, tableConfig, tableStorageKey])

	return (
		<>
			{tableHeader}
			<AntdTable<DataType>
				ref={tableRef}
				className={classNames('se-table', className)}
				scroll={{ y: tableHeight, x: scrollX }}
				size={screens.xxl ? 'large' : 'small'}
				dataSource={tableData.data ?? []}
				columns={cols}
				rowKey={(record) => {
					const rowKey = generateRowKey(JSON.stringify(record))

					return tableId + '-' + rowKey
				}}
				{...restProps}
				onChange={(pagination, filters, sorter) => {
					if (!Array.isArray(sorter)) {
						const sorterObject = sorter.order
							? { field: sorter.field as keyof DataType, order: sorter.order }
							: undefined

						const paginationObject =
							pagination.current && pagination.pageSize
								? {
										offset: (pagination.current - 1) * pagination.pageSize,
										size: pagination.pageSize,
								  }
								: undefined

						setTableConfig((prevConfig) => ({
							...prevConfig,
							filters: filters as TFilters<keyof DataType>,
							sorter: sorterObject,
							pagination: paginationObject,
						}))
					}
				}}
				pagination={
					pagination === false
						? false
						: {
								pageSize: tableConfig.pagination?.size,
								pageSizeOptions: paginationOptions,
								total: tableData.totalCount,
								showTotal: pagination?.showTotal
									? pagination.showTotal
									: (total, range) => {
											return `${range[0]}-${range[1]} sur ${formatNumberWithDots(total)}`
									  },
								locale: {
									next_page: 'Page suivante',
									prev_page: 'Page précédente',
								},
						  }
				}
			/>
		</>
	)
}

export function Table<DataType extends AnyObject>(props: ITableProps<DataType>) {
	return (
		<Suspense fallback={<LoadingTable className={props.className} columns={props.columns} />}>
			<InnerTable {...props} />
		</Suspense>
	)
}
