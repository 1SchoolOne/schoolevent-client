import { FilterConfirmProps } from 'antd/lib/table/interface'
import React from 'react'

import { TOption } from '../../Table-types'

export interface IRadioOrCheckboxDropdownProps {
	useCheckbox?: true
	options: TOption[]
	selectedKeys: React.Key[]
	setSelectedKeys: (selectedKeys: React.Key[]) => void
	clearFilters: (() => void) | undefined
	confirm: (param?: FilterConfirmProps | undefined) => void
}
