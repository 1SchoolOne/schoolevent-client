import { useSuspenseQuery } from '@tanstack/react-query'
import { Table as AntdTable, Grid } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { useLocalStorage } from '@utils'

import { ITableConfig, ITableProps } from './Table-types'
import {
	generateRowKey,
	getPaginationSizeOptions,
	loadStorage,
	useTableHeight,
} from './Table-utils'
import { LoadingTable } from './_components/LoadingTable/LoadingTable'

const { useBreakpoint } = Grid

// TODO: fix data not updating on page change
function InnerTable<DataType extends AnyObject>(props: ITableProps<DataType>) {
	const { tableId, dataSource, columns, pagination, ...restProps } = props
	const [tableConfig, setTableConfig] = useState<ITableConfig<DataType>>(
		loadStorage<DataType>(tableId),
	)
	const tableRef = useRef<TableRef>(null)
	const tableHeight = useTableHeight(tableRef)

	// check how to get the totalCount in both case (fetch/static)
	const { data: tableData } = useSuspenseQuery({
		queryKey: [tableId, { filters: tableConfig.filters, sorter: tableConfig.sorter }],
		queryFn: async () => {
			if (typeof dataSource !== 'function') {
				return dataSource
			}

			return await dataSource(tableConfig.filters, tableConfig.sorter, tableConfig.pagination)
		},
	})
	useEffect(() => {
		console.log({ tableConfig })
		storage.set({ key: tableStorageKey, data: tableConfig as unknown as Record<string, unknown> })
	}, [tableConfig])

	const storage = useLocalStorage()
	const screens = useBreakpoint()

	const tableStorageKey = `${tableId}.table`

	const paginationOptions = useMemo(() => getPaginationSizeOptions(pagination), [pagination])

	const cols: typeof columns = useMemo(
		() =>
			columns.map((col) => ({
				...col,
				filteredValue: tableConfig.filters?.[col.dataIndex as string],
				sortOrder:
					tableConfig.sorter?.field === col.dataIndex ? tableConfig.sorter?.order : undefined,
			})),
		[tableConfig.filters, tableConfig.sorter, columns],
	)

	return (
		<AntdTable<DataType>
			ref={tableRef}
			scroll={{ y: tableHeight }}
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
						filters,
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
										return `${range[0]}-${range[1]} sur ${total}`
								  },
							locale: {
								next_page: 'Page suivante',
								prev_page: 'Page précédente',
							},
					  }
			}
		/>
	)
}

export function Table<DataType extends AnyObject>(props: ITableProps<DataType>) {
	return (
		<Suspense fallback={<LoadingTable columns={props.columns} />}>
			<InnerTable {...props} />
		</Suspense>
	)
}
