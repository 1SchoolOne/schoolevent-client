import { ReactNode } from 'react'

import { useSupabase } from '@utils'

import { Database } from './supabase'

export type { Database } from './supabase'
export type TSupabase = ReturnType<typeof useSupabase>

export type EmptyObject = Record<string, never>

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export interface Feature {
	type: string
	geometry: {
		type: string
		coordinates: [number, number]
	}
	properties: {
		label: string
		score: number
		housenumber: string
		id: string
		type: string
		name: string
		postcode: string
		citycode: string
		x: number
		y: number
		city: string
		context: string
		importance: number
		street: string
	}
}

export interface GeoCodeJSON {
	type: 'FeatureCollection'
	version: string
	features: Feature[]
	attribution: string
	licence: string
	query: string
	limit: number
}

export interface IUseUserParams {
	userId: string
	columns?: Array<keyof Database['public']['Tables']['users']['Row']>
}

export type TContact = Database['public']['Tables']['contacts']['Row']

export * from './localStorage'
export * from './useCopyToClipboard'
export * from './appointments'
export * from './events'
export * from './rewards'
