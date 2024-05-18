import { Grid, Skeleton, Table } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import { TableRef } from 'antd/lib/table'
import classNames from 'classnames'
import { useRef } from 'react'

import { generateRowKey, getScrollX } from '../../Table-utils'
import { ILoadingTableProps } from './LoadingTable-types'

const { useBreakpoint } = Grid

export function LoadingTable<DataType extends AnyObject>(props: ILoadingTableProps<DataType>) {
	const { className, columns, tableHeader } = props
	const screens = useBreakpoint()
	const tableRef = useRef<TableRef>(null)

	const dataIndexes = columns.map((c) => c.dataIndex as string)
	const fakeData = []

	for (let i = 0; i < 25; i++) {
		const values: Record<string, unknown> = {}

		dataIndexes.forEach((dataIndex, index) => {
			values[dataIndex] = `${dataIndex}-${i}-${index}`
		})

		fakeData.push(values)
	}

	const cols = columns.map((c) => ({
		...c,
		render: () => (
			<Skeleton
				title={{
					width: '100%',
					style: {
						height: 20,
					},
				}}
				paragraph={{
					rows: 0,
				}}
				active
			/>
		),
	}))

	const scrollX = getScrollX(tableRef)

	return (
		<>
			{tableHeader}
			<Table<AnyObject>
				ref={tableRef}
				size={screens.xxl ? 'large' : 'small'}
				tableLayout="fixed"
				scroll={{
					x: scrollX,
				}}
				className={classNames('se-table--loading', className)}
				columns={cols}
				rowKey={(record) => {
					const rowKey = generateRowKey(JSON.stringify(record))

					return 'se-loading-table-' + rowKey
				}}
				dataSource={fakeData}
				pagination={{
					pageSize: 25,
				}}
				locale={{ emptyText: 'Chargement des données' }}
			/>
		</>
	)
}
