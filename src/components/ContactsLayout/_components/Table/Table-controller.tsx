import { Star as FavoriteIcon } from '@phosphor-icons/react'
import { Button, Grid } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useMemo } from 'react'

import { getRadioOrCheckboxFilterConfig, useGetColumnSearchFilterConfig } from '@components'
import { useAuth, useFavorites, useMapDisplay } from '@contexts'

import { ColumnsType } from '../../../Table/Table-types'
import { ISchool, ITableControllerParams } from './Table-types'

dayjs.extend(utc)
dayjs.extend(timezone)

const { useBreakpoint } = Grid

export function useController(params: ITableControllerParams) {
	// TODO: implement global search in <Table/> component
	const { globalSearch } = params
	const { user } = useAuth()
	const { mapDisplayState } = useMapDisplay()
	const { addFavorite, removeFavorite, doesFavoriteExist } = useFavorites()
	const screens = useBreakpoint()

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

	const columnSearchFilter = useGetColumnSearchFilterConfig<ISchool>()

	const columns = useMemo<ColumnsType<ISchool>>(
		() =>
			mapDisplayState.isHidden
				? [
						{
							key: 'nom_etablissement',
							title: 'Établissement',
							dataIndex: 'nom_etablissement',
							...columnSearchFilter,
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
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'code_postal',
							title: 'Code postal',
							dataIndex: 'code_postal',
							width: screens.xxl ? 160 : 140,
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'adresse_1',
							title: 'Adresse',
							dataIndex: 'adresse_1',
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'favoris',
							title: 'Favoris',
							dataIndex: 'favoris',
							width: screens.xxl ? 100 : 75,
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
				  ]
				: [
						{
							key: 'nom_etablissement',
							title: 'Établissement',
							dataIndex: 'nom_etablissement',
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'type_etablissement',
							title: 'Type',
							dataIndex: 'type_etablissement',
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'nom_commune',
							title: 'Commune',
							dataIndex: 'nom_commune',
							...columnSearchFilter,
							filterMultiple: true,
							sorter: true,
						},
						{
							key: 'favoris',
							title: 'Favoris',
							dataIndex: 'favoris',
							width: screens.xxl ? 100 : 75,
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
		[screens.xxl, mapDisplayState.isHidden],
	)

	return {
		columns,
	}
}
