import { Button } from 'antd'
import classNames from 'classnames'

import { IIconButtonProps } from './IconButton-types'

import './IconButton-styles.less'

export function IconButton(props: IIconButtonProps) {
	const { className } = props

	return <Button {...props} className={classNames('icon-button', className)} />
}
