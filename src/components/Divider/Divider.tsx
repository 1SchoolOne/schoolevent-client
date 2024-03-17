import { DotsThree as MoreIcon } from '@phosphor-icons/react'
import { Dropdown, Tooltip, Typography } from 'antd'
import classNames from 'classnames'

import { IconButton } from '../IconButton/IconButton'
import { IDividerProps } from './Divider-types'

import './Divider-styles.less'

function Splitter() {
	return (
		<div
			style={{
				height: 'var(--ant-line-width)',
				width: '100%',
				backgroundColor: 'var(--ant-color-split)',
			}}
		></div>
	)
}

/**
 * This is a customized divider inspired by antd's `Divider` component.
 * It allows to add actions. __However__, this custom divider can be used in
 * __horizontal mode only__.
 */
export function Divider(props: IDividerProps) {
	const { title, icon, mainAction: iconButtonProps, moreActions: dropdownProps } = props

	const getNumberOfItems = () => {
		let numberOfItem = 1

		if (icon) numberOfItem++
		if (iconButtonProps) numberOfItem++
		if (dropdownProps) numberOfItem++

		return numberOfItem
	}

	const numberOfItems = getNumberOfItems()

	const renderMainAction = () => {
		if (iconButtonProps) {
			const { render, tooltip: tooltipProps, ...restProps } = iconButtonProps

			if (render) {
				return render(
					<Tooltip {...tooltipProps}>
						<IconButton type="text" {...restProps} />
					</Tooltip>,
				)
			} else {
				return (
					<Tooltip {...tooltipProps}>
						<IconButton type="text" {...restProps} />
					</Tooltip>
				)
			}
		}

		return null
	}

	return (
		<div
			className={classNames('divider', `divider--${numberOfItems}-items`, {
				'divider--with-icon': !!icon,
			})}
		>
			<Splitter />
			{icon && icon}
			<Typography.Title level={5}>{title}</Typography.Title>
			<Splitter />
			{dropdownProps && (
				<Dropdown {...dropdownProps}>
					<IconButton
						icon={<MoreIcon size={16} weight="bold" />}
						type="text"
						title="Autre(s) action(s)"
					/>
				</Dropdown>
			)}
			{renderMainAction()}
		</div>
	)
}
