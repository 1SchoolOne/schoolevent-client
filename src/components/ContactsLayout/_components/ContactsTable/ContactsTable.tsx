import { Space, Typography } from 'antd'

import { Table } from '@components'
import { useFavorites, useMapDisplay, useTheme } from '@contexts'

import { useGeoLocation } from '../../../ContactsMap/ContactsMap-utils'
import { formatNumberWithDots } from '../../../Table/Table-utils'
import { SELECTED_FIELDS } from './Table-constants'
import { IAPIResponse, ISchool, ITableProps } from './Table-types'
import {
	fetchTableData,
	getGlobalSearch,
	getOrderBy,
	getRowClassname,
	getWhere,
  useColumns
} from './Table-utils'

export function ContactsTable() {
	const { setFocusedPin } = useMapDisplay()
	const { theme } = useTheme()
	const columns = useColumns()
	const { favorites } = useFavorites()
	const location = useGeoLocation()

	return (
		<Table<ISchool>
			tableId="contacts"
			className="contacts-table"
			onHeaderRow={() => ({ className: `contacts-table__header__${theme}` })}
			rowClassName={(_record, index) => getRowClassname(index, theme)}
			dataSource={async (filters, sorter, pagination, globalSearch) => {
				const gblSearch = getGlobalSearch(globalSearch ?? '')
				const orderBy = getOrderBy(sorter)
				const where = getWhere(filters, gblSearch, null, location)

				const res = await fetchTableData({
					limit: pagination?.size ?? 25,
					offset: pagination?.offset ?? 0,
					select: SELECTED_FIELDS,
					where: where,
					orderBy,
				}).then((response) => response.json() as Promise<IAPIResponse>)

				const dataWithFavorites: ISchool[] = res.results.map((record) => ({
					...record,
					favoris: favorites.some((fav) => fav.school_id === record.identifiant_de_l_etablissement),
				}))

				return { data: dataWithFavorites, totalCount: res.total_count }
			}}
			onRow={(record) => ({
				onClick: () => {
					if (record.latitude && record.longitude) {
						setFocusedPin({ lat: record.latitude, lng: record.longitude })
					}
				},
			})}
			showResetFilters
			globalSearch={{
				searchedFields: ['Établissement', 'Commune', 'Code postal', 'Adresse'],
			}}
			defaultFilters={{
				nom_etablissement: null,
				type_etablissement: null,
				nom_commune: null,
				code_postal: null,
				adresse_1: null,
			}}
			columns={columns}
			pagination={{
				showTotal: (total, range) => {
					return `${range[0]}-${range[1]} sur ${formatNumberWithDots(total)} établissements`
				},
			}}
			expandable={{
				expandedRowRender: (record) => {
					return (
						<Space direction="horizontal" size="large">
							<span>
								<Typography.Text strong>Email : </Typography.Text>
								{record.mail}
							</span>
							<span>
								<Typography.Text strong>Téléphone : </Typography.Text> {record.telephone}
							</span>
						</Space>
					)
				},
				expandRowByClick: false,
				showExpandColumn: true,
				rowExpandable: (record) => !!record,
			}}
			locale={{
				emptyText: 'Aucun établissement trouvé',
				filterConfirm: 'OK',
				filterReset: 'Réinitialiser',
				filterTitle: 'Filtres',
				selectAll: 'Tout sélectionner',
				selectInvert: 'Inverser la sélection',
				sortTitle: 'Trier',
				triggerAsc: 'Trier par ordre croissant',
				triggerDesc: 'Trier par ordre décroissant',
				cancelSort: 'Annuler le tri',
			}}
		/>
	)
}
