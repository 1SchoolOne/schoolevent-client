import { ITableConfigState, TSetTableConfig } from '../Table/Table-types'
import { Dispatch, SetStateAction } from 'react'

export interface IContactsLayoutHeaderProps {
	tableConfigReducer: {
		tableConfig: ITableConfigState
		setTableConfig: TSetTableConfig
	}
	setGlobalSearch:  Dispatch<SetStateAction<string>>
}
