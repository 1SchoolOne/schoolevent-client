import {
	FileCsv as CSVIcon,
	BookOpenText as GovContactsIcon,
	AddressBook as MyContactsIcon,
} from '@phosphor-icons/react'
import { Button, Segmented, Space, Typography } from 'antd'
import { useState } from 'react'

import { Table } from '@components'
import { useAuth, useContacts, useFavorites, useMapDisplay } from '@contexts'
import { TContact } from '@types'
import { useSupabase } from '@utils'

import { CSVUploadModal } from '../../../ImportCsv/ImportCsv'
import {
	formatNumberWithDots,
	parseFiltersForSupabase,
	parseGlobalSearchForSupabase,
} from '../../../Table/Table-utils'
import { useColumns } from './MyContacts-utils'

export function MyContacts() {
	const supabase = useSupabase()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { favorites } = useFavorites()
	const { setFocusedPin, mapDisplayState } = useMapDisplay()
	const { user } = useAuth()
	const { dataMode, setDataMode, setContacts } = useContacts()
	const columns = useColumns()

	const isSplitView = mapDisplayState.state === 'split' && !mapDisplayState.isHidden

	const showModal = () => {
		setIsModalOpen(true)
	}
	const closeModal = () => {
		setIsModalOpen(false)
	}

	return (
		<Table<TContact & { favorite: boolean }>
			tableId="my-contacts"
			className="contacts-table my-contacts-table"
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

					<Button type="primary" onClick={showModal} icon={<CSVIcon size={16} />}>
						Import CSV
					</Button>
					{user && <CSVUploadModal open={isModalOpen} onClose={closeModal} userId={user.id} />}

					{globalSearchInput}
					{resetFiltersButton}
				</>
			)}
			additionalQueryKey={[favorites]}
			dataSource={async (filters, sorter, pagination, currentPage, globalSearch) => {
				const from = (currentPage - 1) * pagination!.size
				const to = from + pagination!.size

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
