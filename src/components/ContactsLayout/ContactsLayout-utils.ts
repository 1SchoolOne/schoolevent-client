import { useMapDisplay, useTheme } from '@contexts'

export function useTableContainerClass() {
	const { mapDisplayState } = useMapDisplay()

	if (mapDisplayState.isHidden) {
		return 'table-container table-container__full'
	} else if (mapDisplayState.state === 'full') {
		return 'table-container table-container__hidden'
	} else {
		return 'table-container'
	}
}

export function useMapContainerClass() {
	const { mapDisplayState } = useMapDisplay()
	const { theme } = useTheme()

	const defaultCls = 'map-container map-container__' + theme

	if (mapDisplayState.isHidden) {
		return defaultCls + ' ' + 'map-container__hidden'
	} else if (mapDisplayState.state === 'full') {
		return defaultCls + ' ' + 'map-container__full'
	} else {
		return defaultCls
	}
}
