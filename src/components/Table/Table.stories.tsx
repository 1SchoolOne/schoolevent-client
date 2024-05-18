import { Check, X } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react'

import { Table } from './Table'
import {
	getColumnSearchFilterConfig,
	getRadioOrCheckboxFilterConfig,
	getStaticColumnSearchFilterConfig,
	getStaticRadioOrCheckboxFilterConfig,
} from './Table-utils'
import { DEFAULT_FILTERS, SIMPLE_COLUMNS, STATIC_DATA } from './Table.stories-constants'

const meta: Meta<typeof Table> = {
	component: Table,
}

export default meta
type Story = StoryObj<
	typeof Table<{ id: number; userId: number; title: string; completed: boolean }>
>

export const SimpleStaticData: Story = {
	args: {
		tableId: 'simple-static-data',
		title: () => 'Static todos',
		columns: SIMPLE_COLUMNS,
		dataSource: {
			data: STATIC_DATA,
			totalCount: STATIC_DATA.length,
		},
		defaultFilters: DEFAULT_FILTERS,
	},
}

export const SimpleDynamicData: Story = {
	args: {
		tableId: 'simple-dynamic-data',
		title: () => 'Dynamic todos',
		columns: SIMPLE_COLUMNS,
		dataSource: async (_filters, _sorter, pagination, currentPage) => {
			const query = `?_page=${currentPage}&_per_page=${pagination?.size}&_sort=id`

			const data = await fetch(`https://jsonplaceholder.typicode.com/todos${query}`).then(
				(response) => response.json(),
			)

			return { data, totalCount: 200 }
		},
		defaultFilters: DEFAULT_FILTERS,
	},
}

export const StaticDataWithFilters: Story = {
	args: {
		tableId: 'static-data-with-filters',
		title: () => 'Static todos with filters',
		columns: [
			{
				dataIndex: 'id',
				title: 'ID',
			},
			{
				dataIndex: 'userId',
				title: 'User ID',
			},
			{
				dataIndex: 'title',
				title: 'Titre',
				...getStaticColumnSearchFilterConfig('title', { current: null }),
			},
			{
				dataIndex: 'completed',
				title: 'Terminé',
				...getStaticRadioOrCheckboxFilterConfig({
					dataIndex: 'completed',
					options: [
						{ label: 'Oui', value: true },
						{ label: 'Non', value: false },
					],
				}),
				render: (value) => {
					if (value) {
						return <Check size={16} color="green" />
					}

					return <X size={16} color="red" />
				},
			},
		],
		dataSource: { data: STATIC_DATA, totalCount: STATIC_DATA.length },
		defaultFilters: DEFAULT_FILTERS,
		showResetFilters: true,
	},
}

export const DynamicDataWithFilters: Story = {
	args: {
		tableId: 'dynamic-data-with-filters',
		title: () => 'Dynamic todos with filters',
		columns: [
			{
				dataIndex: 'id',
				title: 'ID',
			},
			{
				dataIndex: 'userId',
				title: 'User ID',
			},
			{
				dataIndex: 'title',
				title: 'Titre',
				...getColumnSearchFilterConfig({ current: null }),
			},
			{
				dataIndex: 'completed',
				title: 'Terminé',
				...getRadioOrCheckboxFilterConfig({
					options: [
						{ label: 'Oui', value: true },
						{ label: 'Non', value: false },
					],
				}),
				render: (value) => {
					if (value) {
						return <Check size={16} color="green" />
					}

					return <X size={16} color="red" />
				},
			},
		],
		dataSource: async (filters, _sorter, pagination, currentPage) => {
			// The '_like' directive allows to query for a partial match rather than a strict match in JSONPlaceholder API.
			const filtersQuery = `${filters?.title ? `&title_like=${filters.title}` : ''}${
				filters?.completed ? `&completed=${filters.completed}` : ''
			}`
			const query = `?_page=${currentPage}&_per_page=${pagination?.size}&_sort=id${filtersQuery}`

			const data = await fetch(`https://jsonplaceholder.typicode.com/todos${query}`).then(
				(response) => response.json(),
			)

			return { data, totalCount: 200 }
		},
		defaultFilters: DEFAULT_FILTERS,
		showResetFilters: true,
	},
}

export const StaticDataWithSorters: Story = {
	args: {
		tableId: 'static-data-with-sorters',
		title: () => 'Static todos with sorters',
		columns: [
			{
				dataIndex: 'id',
				title: 'ID',
				sorter: (rowA, rowB) => {
					if (rowA.id < rowB.id) {
						return -1
					} else if (rowA.id > rowB.id) {
						return 1
					}

					return 0
				},
			},
			{
				dataIndex: 'userId',
				title: 'User ID',
				sorter: (rowA, rowB) => {
					if (rowA.userId < rowB.userId) {
						return -1
					} else if (rowA.userId > rowB.userId) {
						return 1
					}

					return 0
				},
			},
			{
				dataIndex: 'title',
				title: 'Titre',
				sorter: (rowA, rowB) => {
					if (rowA.title < rowB.title) {
						return -1
					} else if (rowA.title > rowB.title) {
						return 1
					}

					return 0
				},
				...getStaticColumnSearchFilterConfig('title', { current: null }),
			},
			{
				dataIndex: 'completed',
				title: 'Terminé',
				sorter: (rowA, rowB) => {
					if (rowA.completed < rowB.completed) {
						return -1
					} else if (rowA.completed > rowB.completed) {
						return 1
					}

					return 0
				},
				...getStaticRadioOrCheckboxFilterConfig({
					dataIndex: 'completed',
					options: [
						{ label: 'Oui', value: true },
						{ label: 'Non', value: false },
					],
				}),
				render: (value) => {
					if (value) {
						return <Check size={16} color="green" />
					}

					return <X size={16} color="red" />
				},
			},
		],
		dataSource: { data: STATIC_DATA, totalCount: STATIC_DATA.length },
		defaultFilters: DEFAULT_FILTERS,
		showResetFilters: true,
	},
}

export const DynamicDataWithSorters: Story = {
	args: {
		tableId: 'dynamic-data-with-sorters',
		title: () => 'Dynamic todos with sorters',
		columns: [
			{
				dataIndex: 'id',
				title: 'ID',
				sorter: true,
			},
			{
				dataIndex: 'userId',
				title: 'User ID',
				sorter: true,
			},
			{
				dataIndex: 'title',
				title: 'Titre',
				sorter: true,
				...getColumnSearchFilterConfig({ current: null }),
			},
			{
				dataIndex: 'completed',
				title: 'Terminé',
				sorter: true,
				...getRadioOrCheckboxFilterConfig({
					options: [
						{ label: 'Oui', value: true },
						{ label: 'Non', value: false },
					],
				}),
				render: (value) => {
					if (value) {
						return <Check size={16} color="green" />
					}

					return <X size={16} color="red" />
				},
			},
		],
		dataSource: async (filters, sorter, pagination, currentPage) => {
			// The '_like' directive allows to query for a partial match rather than a strict match in JSONPlaceholder API.
			const filtersQuery = `${filters?.title ? `&title_like=${filters.title}` : ''}${
				filters?.completed ? `&completed=${filters.completed}` : ''
			}`
			const sortQuery = sorter?.order
				? `&_sort=${sorter.field}${sorter.order === 'descend' ? '&_order=desc' : ''}`
				: ''
			const query = `?_page=${currentPage}&_per_page=${pagination?.size}${sortQuery}${filtersQuery}`

			const data = await fetch(`https://jsonplaceholder.typicode.com/todos${query}`).then(
				(response) => response.json(),
			)

			return { data, totalCount: 200 }
		},
		defaultFilters: DEFAULT_FILTERS,
		showResetFilters: true,
	},
}
