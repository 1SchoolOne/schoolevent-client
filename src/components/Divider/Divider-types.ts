import { DropdownProps, TooltipProps } from 'antd'

import { IIconButtonProps } from '../IconButton/IconButton-types'

export interface IDividerProps {
	title: string
	icon?: React.ReactNode
	/** `IconButton` props + tooltip option. */
	mainAction?: IMainAction
	/** `Dropdown` props. */
	moreActions?: DropdownProps
}

interface IMainAction extends IIconButtonProps {
	tooltip?: TooltipProps
	render?: (button: React.ReactNode) => React.ReactNode
}
