import { Dispatch, SetStateAction } from 'react'

import { ITableConfigState, TSetTableConfig } from '../ContactsTable/Table-types'

export interface IContactsLayoutHeaderProps {
	tableConfigReducer: {
		tableConfig: ITableConfigState
		setTableConfig: TSetTableConfig
	}
	setGlobalSearch: Dispatch<SetStateAction<string>>
}
