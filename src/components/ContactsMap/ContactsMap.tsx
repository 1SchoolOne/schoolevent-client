import { Spin } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { useNavigate } from 'react-router-dom'

import userMapPin from '@assets/user-map-pin.svg'
import { useContacts, useTheme } from '@contexts'

import { MAP_UTILS, renderGovContacts, renderMyContacts, useGeoLocation } from './ContactsMap-utils'
import { MapReloader } from './_components/MapReloader/MapReloader'

import './ContactsMap-styles.less'

const userPinIcon = L.icon({
	iconUrl: userMapPin,
	iconSize: [40, 40],
})

export function ContactsMap() {
	const navigate = useNavigate()
	const location = useGeoLocation()
	const mapRef = useRef(null)
	const { theme } = useTheme()
	const { dataMode, contacts, myContacts } = useContacts()

	const userLocation: { lat: number; lng: number } = useMemo(
		() => ({
			lat: location.geoLocationCoordinates.lat,
			lng: location.geoLocationCoordinates.lng,
		}),
		[location.geoLocationCoordinates.lat, location.geoLocationCoordinates.lng],
	)

	return (
		<MapContainer
			center={userLocation}
			zoom={14}
			scrollWheelZoom={true}
			placeholder={<Spin size="large" />}
			ref={mapRef}
		>
			<MapReloader userLocation={[userLocation.lat, userLocation.lng]} />
			<TileLayer attribution={MAP_UTILS.attribution} url={MAP_UTILS.url} />
			{location.loaded && !location.error && (
				<Marker position={userLocation} icon={userPinIcon} title="Vous" alt="user-pin">
					<Popup>Vous</Popup>
				</Marker>
			)}
			<MarkerClusterGroup chunkedLoading maxClusterRadius={30}>
				{dataMode === 'my-contacts' && contacts === undefined
					? renderMyContacts(myContacts, theme, navigate)
					: renderGovContacts(contacts, theme, navigate)}
			</MarkerClusterGroup>
		</MapContainer>
	)
}
