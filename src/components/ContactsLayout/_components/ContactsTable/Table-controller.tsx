import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Button, Grid, InputRef } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo, useRef } from 'react'

import { getColumnSearchFilterConfig, getRadioOrCheckboxFilterConfig } from '@components'
import { useAuth, useFavorites } from '@contexts'

import { ColumnsType } from '../../../Table/Table-types'
import { ISchool } from './Table-types'

dayjs.extend(utc)
dayjs.extend(timezone)

const { useBreakpoint } = Grid

export function useColumns() {
	const { user } = useAuth()
	const { addFavorite, removeFavorite, doesFavoriteExist } = useFavorites()
	const screens = useBreakpoint()
	const inputRef = useRef<InputRef>(null)

	const handleFavorites = async (record: ISchool) => {
		if (user) {
			const exists = await doesFavoriteExist(record.identifiant_de_l_etablissement!, user.id)

			if (exists) {
				removeFavorite(record.identifiant_de_l_etablissement!)
			} else {
				addFavorite({
					school_id: record.identifiant_de_l_etablissement!,
					school_name: record.nom_etablissement,
					school_city: record.nom_commune,
					school_postal_code: record.code_postal,
					created_at: dayjs().tz().toISOString(),
				})
			}
		}
	}

	const columns = useMemo<ColumnsType<ISchool>>(
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

	return {
		columns,
	}
}
