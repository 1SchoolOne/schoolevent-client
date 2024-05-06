import { Star as FavoriteIcon } from '@phosphor-icons/react/Star'
import { Button, Grid, InputRef } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useMemo, useRef } from 'react'

import {
	ColumnsType,
	getColumnSearchFilterConfig,
	getRadioOrCheckboxFilterConfig,
} from '@components'
import { useAuth, useFavorites } from '@contexts'

import { ISchool } from '../ContactsTable/ContactsTable-types'

const { useBreakpoint } = Grid

export function useColumns() {
	const { addFavorite, removeFavorite, doesFavoriteExist } = useFavorites()
	const { user } = useAuth()
	const screens = useBreakpoint()
	const inputRef = useRef<InputRef>(null)

	const handleFavorites = useCallback(
		async (record: ISchool) => {
			if (user && record.identifiant_de_l_etablissement) {
				const exists = await doesFavoriteExist(record.identifiant_de_l_etablissement, user.id)

				if (exists) {
					removeFavorite(record.identifiant_de_l_etablissement)
				} else {
					addFavorite({
						school_id: String(record.identifiant_de_l_etablissement),
						school_name: record.nom_etablissement,
						school_city: record.nom_commune,
						school_postal_code: record.code_postal,
						contact_id: null,
						created_at: dayjs().tz().toISOString(),
					})
				}
			}
		},
		[user, doesFavoriteExist, removeFavorite, addFavorite],
	)

	return useMemo<ColumnsType<ISchool>>(
		() => [
			{
				key: 'nom_etablissement',
				title: 'Établissement',
				dataIndex: 'nom_etablissement',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'type_etablissement',
				title: 'Type',
				dataIndex: 'type_etablissement',
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
				key: 'nom_commune',
				title: 'Commune',
				dataIndex: 'nom_commune',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'code_postal',
				title: 'Code postal',
				dataIndex: 'code_postal',
				width: screens.xxl ? 160 : 140,
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'adresse_1',
				title: 'Adresse',
				dataIndex: 'adresse_1',
				...getColumnSearchFilterConfig(inputRef),
				filterMultiple: true,
				sorter: true,
			},
			{
				key: 'favoris',
				title: 'Favoris',
				dataIndex: 'favoris',
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
