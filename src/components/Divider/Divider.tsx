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
	const { title, mainAction: iconButtonProps, moreActions: dropdownProps } = props

	const getNumberOfItems = () => {
		if (iconButtonProps && dropdownProps) {
			return 3
		} else if (iconButtonProps || dropdownProps) {
			return 2
		} else {
			return 1
		}
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
		<div className={classNames('divider', `divider--${numberOfItems}-items`)}>
			<Splitter />
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
