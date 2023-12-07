import { Table as AntdTable } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { useEffect, useReducer } from 'react'

import { INIT_TABLE_STATE, SELECTED_FIELDS } from './Table-constants'
import { ISchool } from './Table-types'
import { fetchTableData, reducer } from './Table-utils'

import './Table-styles.less'

export function Table() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)

	useEffect(() => {
		const fetchData = async () => {
			setTableConfig({ type: 'SET_LOADING', payload: { loading: true } })

			const response = await fetchTableData({
				limit: tableConfig.paginationSize,
				offset: tableConfig.offset,
				select: SELECTED_FIELDS,
				where: 'type_etablissement="Lycée" OR type_etablissement="Collège"',
				orderBy: tableConfig.orderBy,
			})
			const data = await response.json()

			setTableConfig({ type: 'SET_DATA', payload: { data } })
			setTableConfig({ type: 'SET_LOADING', payload: { loading: false } })
		}

		fetchData()
	}, [tableConfig.paginationSize, tableConfig.offset, tableConfig.orderBy])

	const columns: ColumnsType<ISchool> = [
		{
			key: 'nom_etablissement',
			title: 'Établissement',
			dataIndex: 'nom_etablissement',
			sorter: true,
		},
		{
			key: 'type_etablissement',
			title: "Type d'établissement",
			dataIndex: 'type_etablissement',
			sorter: true,
		},
		{ key: 'nom_commune', title: 'Commune', dataIndex: 'nom_commune', sorter: true },
		{ key: 'code_postal', title: 'Code postal', dataIndex: 'code_postal', sorter: true },
		{ key: 'adresse_1', title: 'Adresse', dataIndex: 'adresse_1', sorter: true },
	]

	return (
		<AntdTable
			className="contacts-table"
			columns={columns}
			dataSource={tableConfig.data}
			loading={tableConfig.loading}
			pagination={{
				pageSize: tableConfig.paginationSize,
				showSizeChanger: false,
				total: tableConfig.totalCount,
				onChange: (page, pageSize) => {
					const offset = (page - 1) * pageSize

					setTableConfig({ type: 'SET_OFFSET', payload: { offset } })
				},
			}}
			onChange={(_pagination, _filters, sorter) => {
				if (!Array.isArray(sorter)) {
					const order = sorter.order === 'ascend' ? 'ASC' : 'DESC'

					setTableConfig({
						type: 'SET_ORDER_BY',
						payload: { field: sorter.field as keyof ISchool, order },
					})
				}
			}}
		/>
	)
}
