import { InputRef } from 'antd'
import { FilterDropdownProps } from 'antd/lib/table/interface'
import { RefObject } from 'react'

export interface ISearchDropdownProps {
	inputRef: RefObject<InputRef>
	confirm: FilterDropdownProps['confirm']
	clearFilters: FilterDropdownProps['clearFilters']
	selectedKeys: FilterDropdownProps['selectedKeys']
	setSelectedKeys: FilterDropdownProps['setSelectedKeys']
}
