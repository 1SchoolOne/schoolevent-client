import { Table as AntdTable } from 'antd'
import { ColumnsType, TableRef } from 'antd/lib/table'
import { useEffect, useLayoutEffect, useReducer, useRef } from 'react'

import { ITableStorage } from '@types'
import { useLocalStorage } from '@utils'

import { INIT_TABLE_STATE, SELECTED_FIELDS } from './Table-constants'
import { ISchool } from './Table-types'
import { fetchTableData, getSortOrder, reducer } from './Table-utils'

import './Table-styles.less'

export function Table() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
	const localStorage = useLocalStorage()
	const tableRef = useRef<TableRef>(null)

	useLayoutEffect(() => {
		// This part is used to either set the table config from the local storage
		// or to set the local storage with the table config
		if (localStorage.has('contacts.table')) {
			const { orderBy, paginationSize } = localStorage.get('contacts.table') as ITableStorage

			if (orderBy) {
				const field = orderBy?.split(' ')[0] as keyof ISchool
				const order = orderBy?.split(' ')[1] as 'ASC' | 'DESC'

				setTableConfig({ type: 'SET_ORDER_BY', payload: { field, order } })
			} else {
				setTableConfig({
					type: 'SET_ORDER_BY',
					payload: { field: 'nom_etablissement', order: 'ASC' },
				})
			}

			setTableConfig({ type: 'SET_PAGINATION_SIZE', payload: { paginationSize } })
		} else {
			localStorage.set({
				key: 'contacts.table',
				data: { orderBy: null, paginationSize: INIT_TABLE_STATE.paginationSize },
			})
		}

		// Here we set the table body height to fit its container (whole component height)
		// minus the header height (55px)
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		const height = window.innerHeight - top - 55

		setTableConfig({ type: 'SET_TABLE_HEIGHT', payload: { height } })
	}, [tableRef, localStorage])

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
			sortOrder: getSortOrder('nom_etablissement', tableConfig.orderBy),
		},
		{
			key: 'type_etablissement',
			title: "Type d'établissement",
			dataIndex: 'type_etablissement',
			sorter: true,
			sortOrder: getSortOrder('type_etablissement', tableConfig.orderBy),
		},
		{
			key: 'nom_commune',
			title: 'Commune',
			dataIndex: 'nom_commune',
			sorter: true,
			sortOrder: getSortOrder('nom_commune', tableConfig.orderBy),
		},
		{
			key: 'code_postal',
			title: 'Code postal',
			dataIndex: 'code_postal',
			sorter: true,
			sortOrder: getSortOrder('code_postal', tableConfig.orderBy),
		},
		{
			key: 'adresse_1',
			title: 'Adresse',
			dataIndex: 'adresse_1',
			sorter: true,
			sortOrder: getSortOrder('adresse_1', tableConfig.orderBy),
		},
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
				pageSizeOptions: [25, 50, 75, 100],
				total: tableConfig.totalCount,
				onShowSizeChange: (_current, size) => {
					setTableConfig({ type: 'SET_PAGINATION_SIZE', payload: { paginationSize: size } })
				},
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

					// The ternary below is used to prevent the column from
					// being stuck in the 'descend' state
					setTableConfig({
						type: 'SET_ORDER_BY',
						payload: sorter.order ? { field: sorter.field as keyof ISchool, order } : null,
					})
				}
			}}
		/>
	)
}
