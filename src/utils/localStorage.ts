import localSotrage from 'store2'

const STORAGE_PREFIX = 'se'

/**
 * Hook version of store2. It will automatically be prefixed by 'se'
 */
export function useLocalStorage() {
	return localSotrage.namespace(STORAGE_PREFIX)
}

/**
 * Function version of store2. It will automatically be prefixed by 'se'
 */
export function getLocalStorage() {
	return localSotrage.namespace(STORAGE_PREFIX)
}
