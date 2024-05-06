import { Segmented, Space, Typography } from 'antd'

import { Table } from '@components'
import { useContacts, useFavorites, useMapDisplay } from '@contexts'

import { useGeoLocation } from '../../../ContactsMap/ContactsMap-utils'
import { formatNumberWithDots } from '../../../Table/Table-utils'
import { DEFAULT_FILTER_OBJECT, SELECTED_FIELDS } from '../ContactsTable/ContactsTable-constants'
import { IAPIResponse, ISchool } from '../ContactsTable/ContactsTable-types'
import {
	fetchGovData,
	getGlobalSearch,
	getOrderBy,
	getWhere,
} from '../ContactsTable/ContactsTable-utils'
import { useColumns } from './GovContacts-utils'

export function GovContacts() {
	const location = useGeoLocation()
	const { favorites } = useFavorites()
	const { setFocusedPin } = useMapDisplay()
	const { dataMode, setDataMode, setContacts } = useContacts()
	const columns = useColumns()

	return (
		<Table<ISchool>
			tableId="gov-contacts"
			additionalQueryKey={[favorites]}
			renderHeader={(resetFiltersButton, globalSearchInput) => (
				<>
					<Segmented
						options={[
							{ label: 'Mes contacts', value: 'my-contacts' },
							{ label: 'Gouvernement', value: 'gov-contacts' },
						]}
						value={dataMode}
						onChange={(value) => setDataMode(value as 'my-contacts' | 'gov-contacts')}
					/>
					{globalSearchInput}
					{resetFiltersButton}
				</>
			)}
			dataSource={async (filters, sorter, pagination, globalSearch) => {
				const gblSearch = getGlobalSearch(globalSearch ?? '')
				const orderBy = getOrderBy(sorter)
				const where = getWhere(filters, gblSearch, null, location)

				const res = await fetchGovData({
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

				setContacts(dataWithFavorites)

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
			defaultFilters={DEFAULT_FILTER_OBJECT}
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
							{record.mail && (
								<span>
									<Typography.Text strong>Email : </Typography.Text>
									{record.mail}
								</span>
							)}
							{record.telephone && (
								<span>
									<Typography.Text strong>Téléphone : </Typography.Text> {record.telephone}
								</span>
							)}
						</Space>
					)
				},
				expandRowByClick: false,
				showExpandColumn: true,
				rowExpandable: (record) => !!record.mail || !!record.telephone,
			}}
			locale={{
				emptyText: 'Aucun établissement trouvé',
			}}
		/>
	)
}
