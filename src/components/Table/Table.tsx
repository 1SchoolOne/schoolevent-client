import { useSuspenseQuery } from '@tanstack/react-query'
import { Table as AntdTable, Grid } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import classNames from 'classnames'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { useTheme } from '@contexts'
import { useLocalStorage } from '@utils'

import { getRowClassname } from '../ContactsLayout/_components/ContactsTable/ContactsTable-utils'
import { IInnerTableProps, ITableConfig, ITableProps, TFilters } from './Table-types'
import {
	defaultRenderHeaderCallback,
	formatNumberWithDots,
	generateRowKey,
	getPaginationSizeOptions,
	getScrollX,
	loadStorage,
	useGlobalSearch,
	useResetFiltersButton,
	useTableHeader,
	useTableHeight,
} from './Table-utils'
import { LoadingTable } from './_components/LoadingTable/LoadingTable'

import './Table-styles.less'

const { useBreakpoint } = Grid

// TODO: add a defaultSortOrder props
function InnerTable<DataType extends AnyObject>(props: IInnerTableProps<DataType>) {
	const {
		tableId,
		dataSource,
		columns,
		pagination,
		className,
		showResetFilters,
		isGlobalSearchEnabled,
		globalSearchValue,
		tableConfig,
		setTableConfig,
		locale,
		additionalQueryKey = [],
		...restProps
	} = props

	const [currentPage, setCurrentPage] = useState(1)
	const tableRef = useRef<TableRef>(null)
	const { theme } = useTheme()
	const storage = useLocalStorage()
	const screens = useBreakpoint()
	const tableHeight = useTableHeight(tableRef, !!showResetFilters && isGlobalSearchEnabled)

	const tableStorageKey = `${tableId}.table`

	const paginationOptions = useMemo(() => getPaginationSizeOptions(pagination), [pagination])

	const { data: tableData } = useSuspenseQuery({
		queryKey: [
			tableId,
			{
				filters: tableConfig.filters,
				sorter: tableConfig.sorter,
				pagination: { ...tableConfig.pagination, currentPage },
				globalSearch: globalSearchValue,
			},
			...additionalQueryKey,
		],
		queryFn: async () => {
			if (typeof dataSource !== 'function') {
				return dataSource
			}

			return await dataSource(
				tableConfig.filters,
				tableConfig.sorter,
				tableConfig.pagination,
				currentPage,
				globalSearchValue,
			)
		},
	})

	const cols: typeof columns = useMemo(
		() =>
			columns.map((col) => ({
				...col,
				width: col.width ?? 200,
				filteredValue: tableConfig.filters?.[col.dataIndex as string],
				sortOrder:
					tableConfig.sorter?.field === col.dataIndex ? tableConfig.sorter?.order : undefined,
			})),
		[tableConfig.filters, tableConfig.sorter, columns],
	)

	const scrollX = getScrollX(tableRef)

	useEffect(
		function syncLocalStorage() {
			storage.set({
				key: tableStorageKey,
				data: tableConfig,
			})
		},
		[storage, tableConfig, tableStorageKey],
	)

	return (
		<AntdTable<DataType>
			ref={tableRef}
			className={classNames('se-table', className)}
			scroll={{ y: tableHeight, x: scrollX }}
			size={screens.xxl ? 'large' : 'small'}
			dataSource={tableData.data ?? []}
			columns={cols}
			onHeaderRow={() => ({ className: `se-table__header__${theme}` })}
			rowClassName={(_record, index) => getRowClassname(index, theme)}
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
									size: pagination.pageSize,
							  }
							: undefined

					setCurrentPage(pagination.current ?? 0)
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
			locale={{
				emptyText: 'Aucune donnée',
				filterConfirm: 'OK',
				filterReset: 'Réinitialiser',
				filterTitle: 'Filtres',
				selectAll: 'Tout sélectionner',
				selectInvert: 'Inverser la sélection',
				sortTitle: 'Trier',
				triggerAsc: 'Trier par ordre croissant',
				triggerDesc: 'Trier par ordre décroissant',
				cancelSort: 'Annuler le tri',
				...locale,
			}}
		/>
	)
}

export function Table<DataType extends AnyObject>(props: ITableProps<DataType>) {
	const { renderHeader = defaultRenderHeaderCallback } = props
	const [tableConfig, setTableConfig] = useState<ITableConfig<DataType>>(
		loadStorage<DataType>(props.tableId, props.defaultFilters),
	)
	const resetFiltersButton = useResetFiltersButton(() => {
		setTableConfig((prevConfig) => ({
			...prevConfig,
			filters: props.defaultFilters,
			sorter: undefined,
		}))
	}, props.showResetFilters)
	const { globalSearchInput, globalSearchValue } = useGlobalSearch(
		props.globalSearch?.searchedFields,
	)

	const tableHeader = useTableHeader({
		resetFiltersButton,
		globalSearchInput,
		callback: renderHeader,
	})

	return (
		<Suspense
			fallback={
				<LoadingTable
					className={props.className}
					columns={props.columns}
					tableHeader={tableHeader}
				/>
			}
		>
			{tableHeader}
			<InnerTable
				{...props}
				tableConfig={tableConfig}
				setTableConfig={setTableConfig}
				isGlobalSearchEnabled={!!props.globalSearch?.searchedFields}
				globalSearchValue={globalSearchValue}
			/>
		</Suspense>
	)
}
