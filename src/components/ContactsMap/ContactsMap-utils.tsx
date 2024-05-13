import { Plus as NewIcon } from '@phosphor-icons/react/Plus'
import { Button, Space, Typography } from 'antd'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { NavigateFunction } from 'react-router-dom'

import collegeMapPin from '@assets/college-map-pin.svg'
import genericMapPin from '@assets/generic-map-pin.svg'
import lyceeMapPin from '@assets/lycee-map-pin.svg'
import { CopyableText } from '@components'
import { TContact } from '@types'

import { ISchool } from '../ContactsLayout/_components/ContactsTable/ContactsTable-types'
import { IGeoLocationState, IPositionError } from './ContactsMap-types'

const lyceePinIcon = L.icon({
	iconUrl: lyceeMapPin,
	iconSize: [40, 40],
})

const collegePinIcon = L.icon({
	iconUrl: collegeMapPin,
	iconSize: [40, 40],
})

const genericPinIcon = L.icon({
	iconUrl: genericMapPin,
	iconSize: [40, 40],
})

export const MAP_UTILS = {
	url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}

export function useGeoLocation() {
	const [location, setLocation] = useState<IGeoLocationState>({
		loaded: false,
		geoLocationCoordinates: { lat: 0, lng: 0 },
		error: null,
	})

	const onSuccess = (location: { coords: { latitude: number; longitude: number } }) => {
		setLocation({
			loaded: true,
			geoLocationCoordinates: {
				lat: location.coords.latitude,
				lng: location.coords.longitude,
			},
			error: null,
		})
	}

	const onError = (error: IPositionError) => {
		setLocation({
			loaded: true,
			geoLocationCoordinates: { lat: 0, lng: 0 },
			error,
		})
	}

	useEffect(() => {
		if (!('geolocation' in navigator)) {
			onError({
				code: 0,
				message: 'Geolocation not supported',
			})
		}

		navigator.geolocation.getCurrentPosition(onSuccess, onError, {
			maximumAge: 24 * 60 * 60 * 1000,
			enableHighAccuracy: true,
		})
	}, [])

	return location
}

function normalize(str: string) {
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function getSchoolPin(type: string | undefined) {
	const schoolType = type ? normalize(type).toLowerCase() : undefined

	switch (schoolType) {
		case 'lycee':
			return lyceePinIcon
		case 'college':
			return collegePinIcon
		default:
			return genericPinIcon
	}
}

export function renderMyContacts(
	data: Array<TContact>,
	theme: 'light' | 'dark',
	navigate: NavigateFunction,
) {
	return data.map((record, index) => {
		if (record.latitude && record.longitude) {
			return (
				<Marker
					key={`marker-${record.id}-${index}`}
					position={[Number(record.latitude), Number(record.longitude)]}
					icon={getSchoolPin(record.school_type)}
					title={record.school_name}
				>
					<Popup className={`map-popup map-popup__${theme}`}>
						<Space direction="vertical" size="small">
							<Space direction="vertical" size={0}>
								<Typography.Text strong>{record.school_name}</Typography.Text>
								<Typography.Text type="secondary">{record.school_type}</Typography.Text>
							</Space>
							<Typography.Text>
								{record.address}, {record.postal_code} {record.city}
							</Typography.Text>
							{record.telephone && <CopyableText label="Tél" text={record.telephone} />}
							{record.mail && <CopyableText label="Email" text={record.mail} />}
							<Button
								type="primary"
								className="create-btn"
								icon={<NewIcon size={16} />}
								onClick={() => {
									navigate(`/appointments?action=new&contact_id=${record.id}`)
								}}
								block
							>
								Créer un suivi
							</Button>
						</Space>
					</Popup>
				</Marker>
			)
		}
	})
}

export function renderGovContacts(data: Array<ISchool>, theme: string, navigate: NavigateFunction) {
	return data.map((school, index) => {
		if (school.latitude && school.longitude) {
			return (
				<Marker
					key={`marker-${school.identifiant_de_l_etablissement}-${index}`}
					position={[school.latitude, school.longitude]}
					icon={school.type_etablissement === 'Lycée' ? lyceePinIcon : collegePinIcon}
					title={school.nom_etablissement}
					alt={school.type_etablissement === 'Collège' ? 'middleschool-pin' : 'highschool-pin'}
				>
					<Popup className={`map-popup map-popup__${theme}`}>
						<Space direction="vertical" size="small">
							<Space direction="vertical" size={0}>
								<Typography.Text strong>{school.nom_etablissement}</Typography.Text>
								<Typography.Text type="secondary">{school.type_etablissement}</Typography.Text>
							</Space>
							<Typography.Text>
								{school.adresse_1}, {school.code_postal} {school.nom_commune}
							</Typography.Text>
							{school.telephone && <CopyableText label="Tél" text={school.telephone} />}
							{school.mail && <CopyableText label="Email" text={school.mail} />}
							<Button
								type="primary"
								className="create-btn"
								icon={<NewIcon size={16} />}
								onClick={() => {
									navigate(
										`/appointments?action=new&school_id=${school.identifiant_de_l_etablissement}`,
									)
								}}
								block
							>
								Créer un suivi
							</Button>
						</Space>
					</Popup>
				</Marker>
			)
		}
	})
}
