import { useMemo } from 'react'
import localStorage from 'store2'

import { TSetStorageParams, TSetStorageReturn, TStorageKey } from '@types'

const STORAGE_PREFIX = 'se'

/**
 * Hook version of store2. It will automatically be prefixed by 'se'
 */
export function useLocalStorage() {
	const storage = localStorage.namespace(STORAGE_PREFIX)

	return useMemo(
		() => ({
			...storage,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			set: ({ key, data }: TSetStorageParams) => {
				storage.set(key, data)
			},
			get: (key: TStorageKey): TSetStorageReturn => storage.get(key),
			has: (key: TStorageKey) => storage.has(key),
		}),
		[storage],
	)
}

/**
 * Function version of store2. It will automatically be prefixed by 'se'
 */
export function getLocalStorage() {
	const storage = localStorage.namespace(STORAGE_PREFIX)

	return {
		...storage,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		set: ({ key, data }: TSetStorageParams) => {
			storage.set(key, data)
		},
		get: (key: TStorageKey): TSetStorageReturn => storage.get(key),
		has: (key: TStorageKey) => storage.has(key),
	}
}
