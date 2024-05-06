import { Dispatch, SetStateAction } from 'react'

export interface IMapDisplayState {
	state: 'split' | 'full'
	isHidden: boolean
}

export interface IMapDisplayContext {
	mapDisplayState: IMapDisplayState
	displayMap: () => void
	hideMap: () => void
	toggleMapState: () => void
	focusedPin: IUserLocation | null
	setFocusedPin: Dispatch<SetStateAction<IUserLocation | null>>
}

export interface IUserLocation {
	lat: number
	lng: number
}
