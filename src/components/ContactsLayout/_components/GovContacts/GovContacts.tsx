import {
	BookOpenText as GovContactsIcon,
	AddressBook as MyContactsIcon,
} from '@phosphor-icons/react'
import { Segmented, Select, Space, Typography } from 'antd'
import { useState } from 'react'

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
	const [range, setRange] = useState<number | null>(null)
	const location = useGeoLocation()
	const { favorites } = useFavorites()
	const { setFocusedPin, mapDisplayState } = useMapDisplay()
	const { dataMode, setDataMode, setContacts } = useContacts()
	const columns = useColumns()

	const isSplitView = mapDisplayState.state === 'split' && !mapDisplayState.isHidden

	return (
		<Table<ISchool>
			tableId="gov-contacts"
			additionalQueryKey={[favorites, range]}
			renderHeader={(resetFiltersButton, globalSearchInput) => (
				<>
					<Segmented
						options={[
							{
								label: isSplitView ? null : 'Mes contacts',
								value: 'my-contacts',
								icon: <MyContactsIcon size={16} />,
								title: 'Mes contacts',
							},
							{
								label: isSplitView ? null : 'Gouvernement',
								value: 'gov-contacts',
								icon: <GovContactsIcon size={16} />,
								title: 'Gouvernement',
							},
						]}
						value={dataMode}
						onChange={(value) => setDataMode(value as 'my-contacts' | 'gov-contacts')}
					/>
					<Space className="range-select">
						{!isSplitView && <Typography.Text>Distance max :</Typography.Text>}
						<Select<number | null>
							disabled={!location.loaded || !!location.error}
							placeholder="Distance max"
							options={[
								{
									label: 'Illimité',
									value: null,
								},
								{
									label: '15km',
									value: 15,
								},
								{
									label: '30km',
									value: 30,
								},
								{
									label: '45km',
									value: 45,
								},
							]}
							value={range}
							onSelect={setRange}
						/>
					</Space>
					{globalSearchInput}
					{resetFiltersButton}
				</>
			)}
			dataSource={async (filters, sorter, pagination, globalSearch) => {
				const gblSearch = getGlobalSearch(globalSearch ?? '')
				const orderBy = getOrderBy(sorter)
				const where = getWhere(filters, gblSearch, range, location)

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
