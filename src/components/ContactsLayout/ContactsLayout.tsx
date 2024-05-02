import {
	XCircle as CloseMapIcon,
	ArrowsOutSimple as ExpandMapIcon,
	MapTrifold as OpenMapIcon,
	ArrowsInSimple as ReduceMapIcon,
} from '@phosphor-icons/react'
import { Layout } from 'antd'
import { useLayoutEffect, useReducer, useState } from 'react'

import { BasicLayout, ContactsMap, FavoritesList, IconButton } from '@components'
import { useMapDisplay } from '@contexts'
import { useDebounce } from '@utils'

import { useMapContainerClass, useTableContainerClass } from './ContactsLayout-utils'
import { ContactsLayoutHeader } from './_components/ContactsLayoutHeader/ContactsLayoutHeader'
import { MapLegend } from './_components/MapLegend/MapLegend'
import { Table } from './_components/Table/Table'
import { INIT_TABLE_STATE } from './_components/Table/Table-constants'
import { reducer } from './_components/Table/Table-utils'

import './ContactsLayout-styles.less'

const { Content, Header } = Layout

// TODO: fix sider overflow
export function ContactsLayout() {
	const [tableConfig, setTableConfig] = useReducer(reducer, INIT_TABLE_STATE)
	const [globalSearch, setGlobalSearch] = useState<string>('')
	const debouncedGlobalSearch = useDebounce<string>(globalSearch, 750)
	const { displayMap, hideMap, toggleMapState, mapDisplayState } = useMapDisplay()
	const tableContainerClass = useTableContainerClass()
	const mapContainerClass = useMapContainerClass()

	useLayoutEffect(() => {
		const header = document.querySelector('.contacts-layout__header') as HTMLElement
		const sider = document.querySelector('.contacts-layout__sider') as HTMLElement

		if (header && sider) {
			const headerHeight = header.clientHeight

			// Set the margin-top of the sider to the height of the header + 1rem (margin of the table container).
			// This is done to make the sider (favorites list) aligns to the table container.
			sider.style.marginTop = `calc(${headerHeight}px + 1rem)`
		}
	}, [])

	return (
		<BasicLayout
			className="contacts-layout"
			sider={<FavoritesList />}
			siderClassName="contacts-layout__sider"
		>
			<Layout className="contacts-layout__table-and-global-search">
				<Header className="contacts-layout__header">
					<ContactsLayoutHeader
						tableConfigReducer={{ tableConfig, setTableConfig }}
						setGlobalSearch={setGlobalSearch}
					/>
				</Header>
				<Content className="contacts-table-container">
					<div className={tableContainerClass}>
						<Table
							globalSearch={debouncedGlobalSearch}
							tableConfigReducer={{ tableConfig, setTableConfig }}
						/>
						{mapDisplayState.isHidden && (
							<IconButton
								className="map-btn open-map-btn"
								onClick={displayMap}
								type="primary"
								icon={<OpenMapIcon size={20} />}
							/>
						)}
					</div>
					<div className={mapContainerClass}>
						<MapLegend />
						<ContactsMap data={tableConfig.data} setTableConfig={setTableConfig} />
						<IconButton
							className="map-btn toggle-mode-btn"
							onClick={toggleMapState}
							type="primary"
							icon={
								mapDisplayState.state === 'full' ? (
									<ReduceMapIcon size={20} />
								) : (
									<ExpandMapIcon size={20} />
								)
							}
						/>
						<IconButton
							className="map-btn close-map-btn"
							onClick={hideMap}
							type="primary"
							icon={<CloseMapIcon size={20} />}
						/>
					</div>
				</Content>
			</Layout>
		</BasicLayout>
	)
}
