import { Table as AntdTable } from 'antd'
import { ColumnsType, TableRef } from 'antd/lib/table'
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'

import { INIT_TABLE_STATE, SELECTED_FIELDS } from './Table-constants'
import { ISchool } from './Table-types'
import { fetchTableData, reducer } from './Table-utils'

import './Table-styles.less'

export function Table() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
	const tableRef = useRef<TableRef>(null)

	// This effect is used to calculate the table height so it can fit
	// properly in its container.
	useLayoutEffect(() => {
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		const height = window.innerHeight - top - 55

		setTableConfig({ type: 'SET_TABLE_HEIGHT', payload: { height } })
	}, [tableRef])

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
		<AntdTable<ISchool>
			ref={tableRef}
			scroll={{ y: tableConfig.tableHeight }}
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
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]} sur ${total} établissements`
				},
			}}
			onChange={(_pagination, _filters, sorter) => {
				if (!Array.isArray(sorter) && Object.entries(sorter).length > 0) {
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
