import {
	XCircle as CloseMapIcon,
	ArrowsOutSimple as ExpandMapIcon,
	MapTrifold as OpenMapIcon,
	ArrowsInSimple as ReduceMapIcon,
} from '@phosphor-icons/react'
import { Layout } from 'antd'

import { BasicLayout, ContactsMap, FavoritesList, IconButton } from '@components'
import { useMapDisplay } from '@contexts'

import { useMapContainerClass, useTableContainerClass } from './ContactsLayout-utils'
import { ContactsTable } from './_components/ContactsTable/ContactsTable'
import { MapLegend } from './_components/MapLegend/MapLegend'

import './ContactsLayout-styles.less'
import { useQueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

const { Content } = Layout

export function ContactsLayout() {
	const { displayMap, hideMap, toggleMapState, mapDisplayState } = useMapDisplay()
	const tableContainerClass = useTableContainerClass()
	const mapContainerClass = useMapContainerClass()
  const queryClient = useQueryClient()

  const data = queryClient.getQueryData(['contacts'])
  console.log(data)

	return (
		<BasicLayout
			className="contacts-layout"
			sider={<FavoritesList />}
			siderClassName="contacts-layout__sider"
		>
			<Layout className="contacts-layout__table-and-global-search">
				<Content className="contacts-table-container">
					<div className={tableContainerClass}>
						<ContactsTable />
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
						<ContactsMap />
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
