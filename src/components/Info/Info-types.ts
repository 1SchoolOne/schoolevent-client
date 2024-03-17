import { TooltipProps } from 'antd'

export type TInfoProps = TInfoTooltipProps | TInfoNoTooltipProps

type TInfoCommonProps = {
	children: React.ReactNode
}

type TInfoTooltipProps = TInfoCommonProps & {
	tooltip: true
	tooltipProps?: Omit<TooltipProps, 'title'>
}

type TInfoNoTooltipProps = TInfoCommonProps & {
	tooltip?: never
	tooltipProps?: never
}
