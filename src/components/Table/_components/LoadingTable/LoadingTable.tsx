import { Table } from 'antd'

import { ColumnsType } from '../../Table-types'

export function LoadingTable({ columns }: { columns: ColumnsType<any> }) {
	return (
		<Table
			columns={columns}
			dataSource={[]}
			loading
			locale={{ emptyText: 'Chargement des données' }}
		/>
	)
}
