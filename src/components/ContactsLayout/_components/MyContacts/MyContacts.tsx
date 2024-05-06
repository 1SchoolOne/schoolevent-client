import { Segmented, Space, Typography } from 'antd'

import { Table } from '@components'
import { useAuth, useContacts, useFavorites, useMapDisplay } from '@contexts'
import { TContact } from '@types'
import { useSupabase } from '@utils'

import {
	formatNumberWithDots,
	parseFiltersForSupabase,
	parseGlobalSearchForSupabase,
} from '../../../Table/Table-utils'
import { useColumns } from './MyContacts-utils'

export function MyContacts() {
	const supabase = useSupabase()
	const { favorites } = useFavorites()
	const { setFocusedPin } = useMapDisplay()
	const { user } = useAuth()
	const { dataMode, setDataMode, setContacts } = useContacts()
	const columns = useColumns()

	return (
		<Table<TContact & { favorite: boolean }>
			tableId="my-contacts"
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
			additionalQueryKey={[favorites]}
			dataSource={async (filters, sorter, pagination, globalSearch) => {
				const from = pagination!.offset
				const to = pagination!.offset + pagination!.size

				let request = supabase
					.from('contacts')
					.select('*', { count: 'exact' })
					.eq('user_id', user!.id)
					.range(from, to)
				const parsedFilters = parseFiltersForSupabase<TContact>(filters)

				if (globalSearch) {
					const gblSearch = parseGlobalSearchForSupabase<TContact>(globalSearch, [
						'school_name',
						'school_type',
						'city',
						'postal_code',
						'address',
						'mail',
						'telephone',
					])

					request = request.or(gblSearch)
				} else if (filters && parsedFilters) {
					request.or(parsedFilters)
				}

				if (sorter) {
					request = request.order(sorter.field, {
						ascending: sorter.order === 'ascend',
					})
				}

				const { data, count, error } = await request

				if (error) {
					throw error
				}

				const dataWithFavorites = data.map((record) => ({
					...record,
					favorite: favorites.some((fav) => fav.contact_id === record.id),
				}))

				setContacts(dataWithFavorites)

				return { data: dataWithFavorites, totalCount: count ?? 0 }
			}}
			columns={columns}
			onRow={(record) => ({
				onClick: () => {
					if (record.latitude && record.longitude) {
						setFocusedPin({ lat: Number(record.latitude), lng: Number(record.longitude) })
					}
				},
			})}
			globalSearch={{
				searchedFields: ['Établissement', 'Commune', 'Code postal', 'Adresse'],
			}}
			showResetFilters
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
				emptyText: 'Aucun contact enregistré',
			}}
			defaultFilters={{
				school_name: null,
				school_type: null,
				city: null,
				postal_code: null,
				address: null,
			}}
		/>
	)
}
