export type TStorageKey = 'contacts.table' | 'sidebar.isCollapsed' | 'comments.sort'

export interface ITableStorage {
	orderBy: string | null
	paginationSize: number
}

export interface ISetTableStorage {
	key: 'contacts.table'
	data: ITableStorage
}

export type ISidebarStorage = boolean

export interface ISetSidebarStorage {
	key: 'sidebar.isCollapsed'
	data: ISidebarStorage
}

export type ICommentSortStorage = 'asc' | 'dsc'

export interface ISetCommentSortStorage {
	key: 'comments.sort'
	data: ICommentSortStorage
}

export type TSetStorageParams = ISetTableStorage | ISetSidebarStorage | ISetCommentSortStorage
export type TGetStorageReturn = ITableStorage | ISidebarStorage | ICommentSortStorage | null
