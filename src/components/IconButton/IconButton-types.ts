import { ButtonProps } from 'antd'

export interface IIconButtonProps extends Omit<ButtonProps, 'icon' | 'children'> {
	icon: React.ReactNode
}
