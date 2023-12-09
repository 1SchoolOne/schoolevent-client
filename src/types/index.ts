import { ReactNode } from 'react'

export type PropsWithOptionalChildren<P = object> = P & { children?: ReactNode }

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export type TStorageKey = 'contacts.table' | 'contacts.favorites'

export interface ITableStorage {
	orderBy: string | null
	paginationSize: number
}

export interface IFavoritesStorage {
	favorites: string[]
}

interface ISetTableStorage {
	key: 'contacts.table'
	data: ITableStorage
}

interface ISetFavoritesStorage {
	key: 'contacts.favorites'
	data: IFavoritesStorage
}

export type TSetStorageParams = ISetTableStorage | ISetFavoritesStorage
export type TSetStorageReturn = ITableStorage | IFavoritesStorage | null
