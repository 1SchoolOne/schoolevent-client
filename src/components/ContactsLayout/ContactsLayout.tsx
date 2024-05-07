import {
	XCircle as CloseMapIcon,
	ArrowsOutSimple as ExpandMapIcon,
	MapTrifold as OpenMapIcon,
	ArrowsInSimple as ReduceMapIcon,
} from '@phosphor-icons/react'

import { BasicLayout, ContactsMap, FavoritesList, IconButton } from '@components'
import { ContactsProvider, useMapDisplay } from '@contexts'

import { useMapContainerClass, useTableContainerClass } from './ContactsLayout-utils'
import { ContactsTable } from './_components/ContactsTable/ContactsTable'
import { MapLegend } from './_components/MapLegend/MapLegend'

import './ContactsLayout-styles.less'

export function ContactsLayout() {
	const { displayMap, hideMap, toggleMapState, mapDisplayState } = useMapDisplay()
	const tableContainerClass = useTableContainerClass()
	const mapContainerClass = useMapContainerClass()

	return (
		<ContactsProvider>
			<BasicLayout
				className="contacts-layout"
				sider={<FavoritesList />}
				siderClassName="contacts-layout__sider"
			>
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
			</BasicLayout>
		</ContactsProvider>
	)
}
