import { Check, X } from '@phosphor-icons/react'

import { ColumnsType } from '@components'

export const DEFAULT_FILTERS = {
	title: null,
	completed: null,
}

export const STATIC_DATA: Array<{ id: number; userId: number; title: string; completed: boolean }> =
	[
		{ id: 1, userId: 2, title: 'toto', completed: false },
		{ id: 2, userId: 1, title: 'azerty', completed: true },
		{ id: 3, userId: 1, title: 'bonjour', completed: false },
		{ id: 4, userId: 2, title: 'rappel', completed: false },
		{ id: 5, userId: 4, title: 'hello', completed: true },
		{ id: 6, userId: 5, title: 'good morning', completed: true },
		{ id: 7, userId: 3, title: 'note #1', completed: false },
		{ id: 8, userId: 3, title: 'note #2', completed: false },
		{ id: 9, userId: 4, title: 'tata', completed: false },
		{ id: 10, userId: 2, title: 'titi', completed: true },
	]

export const SIMPLE_COLUMNS: ColumnsType<{
	id: number
	userId: number
	title: string
	completed: boolean
}> = [
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
	},
	{
		dataIndex: 'completed',
		title: 'Terminé',
		render: (value) => {
			if (value) {
				return <Check size={16} color="green" />
			}

			return <X size={16} color="red" />
		},
	},
]
