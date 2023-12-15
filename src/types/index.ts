import { ReactNode } from 'react'

export type { Database } from './supabase'

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export type TStorageKey = 'contacts.table' | 'contacts.favorites'

export interface ITableStorage {
	orderBy: string | null
	paginationSize: number
}

interface ISetTableStorage {
	key: 'contacts.table'
	data: ITableStorage
}

export type TSetStorageParams = ISetTableStorage
export type TSetStorageReturn = ITableStorage | null
