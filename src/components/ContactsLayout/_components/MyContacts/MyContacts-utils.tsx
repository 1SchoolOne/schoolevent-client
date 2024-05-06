import { Star as FavoriteIcon } from '@phosphor-icons/react/Star'
import { Button, Grid, InputRef } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import { useCallback, useMemo, useRef } from 'react'

import {
	ColumnsType,
	getColumnSearchFilterConfig,
	getRadioOrCheckboxFilterConfig,
} from '@components'
import { useAuth, useFavorites } from '@contexts'
import { TContact } from '@types'

dayjs.extend(timezone)

const { useBreakpoint } = Grid

export function useColumns() {
	const screens = useBreakpoint()
	const inputRef = useRef<InputRef>(null)
	const { addFavorite, removeFavorite, doesFavoriteExist } = useFavorites()
	const { user } = useAuth()

	const handleFavorites = useCallback(
		async (record: TContact & { favorite: boolean }) => {
			if (user) {
				const exists = await doesFavoriteExist(record.id, user.id)

				if (exists) {
					removeFavorite(record.id)
				} else {
					addFavorite({
						school_id: null,
						school_name: record.school_name,
						school_city: record.city,
						school_postal_code: record.postal_code,
						contact_id: record.id,
						created_at: dayjs().tz().toISOString(),
					})
				}
			}
		},
		[user, doesFavoriteExist, removeFavorite, addFavorite],
	)

	return useMemo<ColumnsType<TContact & { favorite: boolean }>>(
		() => [
			{
				key: 'school_name',
				dataIndex: 'school_name',
				title: 'Établissement',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'school_type',
				dataIndex: 'school_type',
				title: 'Type',
				width: screens.xxl ? 110 : 90,
				...getRadioOrCheckboxFilterConfig({
					options: [
						{ label: 'Collège', value: 'Collège' },
						{ label: 'Lycée', value: 'Lycée' },
					],
				}),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'city',
				dataIndex: 'city',
				title: 'Commune',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'postal_code',
				dataIndex: 'postal_code',
				title: 'Code postal',
				width: screens.xxl ? 160 : 140,
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'address',
				dataIndex: 'address',
				title: 'Adresse',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'favorite',
				dataIndex: 'favorite',
				title: 'Favoris',
				width: screens.xxl ? 100 : 75,
				fixed: 'right',
				render: (value, record) => {
					return (
						<Button
							className="favorite-button"
							onClick={async () => {
								await handleFavorites(record)
							}}
							icon={<FavoriteIcon size="1rem" weight={value ? 'fill' : 'regular'} />}
							type="text"
						/>
					)
				},
			},
		],
		[screens.xxl, handleFavorites],
	)
}
