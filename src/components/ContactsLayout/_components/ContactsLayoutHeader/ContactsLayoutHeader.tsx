import {
	Broom as ClearFiltersIcon,
	BookOpen as GovernmentContactsIcon,
	AddressBookTabs as MyContactsIcon,
} from '@phosphor-icons/react'
import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react/MagnifyingGlass'
import { Button, Divider, Input, Segmented, Select, Space, Typography } from 'antd'

import { Info } from '@components'

import { TTableDataMode } from '../ContactsTable/Table-types'
import { IContactsLayoutHeaderProps } from './ContactsLayoutHeader-types'

export function ContactsLayoutHeader(props: IContactsLayoutHeaderProps) {
	const { tableConfigReducer, setGlobalSearch } = props
	const { tableConfig, setTableConfig } = tableConfigReducer

	const resetTableFilters = () => {
		setTableConfig({ type: 'RESET_FILTERS' })
	}

	return (
		<Space direction="horizontal" className="contacts-table__header" size="small">
			<Segmented
				className="contacts-data-mode-segmented"
				value={tableConfig.dataMode}
				options={[
					{ value: 'my_contacts', label: 'Mes contacts', icon: <MyContactsIcon size={16} /> },
					{ value: 'gov_api', label: 'Gouvernement', icon: <GovernmentContactsIcon size={16} /> },
				]}
				onChange={(e) => {
					setTableConfig({ type: 'SET_DATA_MODE', payload: { mode: e as TTableDataMode } })
				}}
			/>
			<Divider type="vertical" />
			<div className="contacts-range-container">
				<Typography.Text>Distance maximale :</Typography.Text>
				<Select
					disabled={
						!tableConfig.userLocation ||
						(tableConfig.userLocation.lat === 0 && tableConfig.userLocation.lng === 0)
					}
					options={[
						{ value: 10, label: '10km' },
						{ value: 25, label: '25km' },
						{
							value: 50,
							label: '50km',
						},
						{ value: 0, label: 'Illimité' },
					]}
					defaultValue={0}
					value={tableConfig.range ?? 0}
					onChange={(value) =>
						setTableConfig({
							type: 'SET_RANGE',
							payload: { range: value === 0 ? null : value },
						})
					}
				/>
			</div>
			<Divider type="vertical" />
			<Space direction="horizontal" className="contacts-global-search">
				<Info tooltip tooltipProps={{ placement: 'bottom' }}>
					<Space direction="vertical">
						<h4>Recherche globale</h4>
						<div>
							Ignore les filtres et recherche dans les champs suivants :
							<ul>
								<li>Établissement</li>
								<li>Commune</li>
								<li>Code postal</li>
								<li>Adresse</li>
							</ul>
						</div>
					</Space>
				</Info>
				<Input
					placeholder="Recherche globale"
					allowClear
					prefix={<SearchIcon />}
					onChange={(e) => {
						setGlobalSearch(e.target.value)
					}}
				/>
			</Space>
			<Divider type="vertical" />
			<Button
				className="clear-filters-btn"
				type="primary"
				icon={<ClearFiltersIcon size="16px" />}
				onClick={() => {
					resetTableFilters()
				}}
			>
				Réinitialiser les filtres
			</Button>
		</Space>
	)
}
