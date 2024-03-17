import { Info as InfoIcon } from '@phosphor-icons/react'
import { Tooltip } from 'antd'

import { TInfoProps } from './Info-types'

import './Info-styles.less'

export function Info(props: TInfoProps) {
	const { children, tooltip, tooltipProps } = props

	if (tooltip) {
		return (
			<Tooltip overlayClassName="info__tooltip" title={children} {...tooltipProps}>
				<InfoIcon className="info__icon" />
			</Tooltip>
		)
	}

	return (
		<div className="info__container">
			<InfoIcon className="info__icon" size="16px" />
			{children}
		</div>
	)
}
