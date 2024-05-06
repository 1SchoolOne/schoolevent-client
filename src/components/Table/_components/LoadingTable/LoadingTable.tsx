import { Grid, Skeleton, Table } from 'antd'
import { AnyObject } from 'antd/lib/_util/type'
import classNames from 'classnames'

import { generateRowKey } from '../../Table-utils'
import { ILoadingTableProps } from './LoadingTable-types'

const { useBreakpoint } = Grid

export function LoadingTable<DataType extends AnyObject>(props: ILoadingTableProps<DataType>) {
	const { className, columns, tableHeader } = props
	const screens = useBreakpoint()

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

	return (
		<>
			{tableHeader}
			<Table<AnyObject>
				size={screens.xxl ? 'large' : 'small'}
				tableLayout="fixed"
				className={classNames('se-table--loading', className)}
				columns={cols}
				rowKey={(record) => {
					const rowKey = generateRowKey(JSON.stringify(record))

					return 'se-loading-table-' + rowKey
				}}
				dataSource={fakeData}
				loading
				pagination={{
					pageSize: 25,
				}}
				locale={{ emptyText: 'Chargement des données' }}
			/>
		</>
	)
}
