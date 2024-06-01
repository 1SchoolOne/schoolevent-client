import { Button } from 'antd'
import classNames from 'classnames'

import { ISuccessButtonProps } from './SuccessButton-types'

import './SuccessButton-styles.less'

export function SuccessButton(props: ISuccessButtonProps) {
	const { className, children, ...restProps } = props

	return (
		<Button {...restProps} className={classNames('se-success-button', className)}>
			{children}
		</Button>
	)
}
