import { Modal as AntdModal, Grid } from 'antd'
import { useNavigate } from 'react-router-dom'

import { IModalProps } from '../../AppointmentsLayout-types'

import './Modal-styles.less'

const { useBreakpoint } = Grid

export function Modal(props: IModalProps) {
	const { onCancelCallback, children, ...modalProps } = props

	const navigate = useNavigate()
	const screens = useBreakpoint()

	const getWidth = () => {
		const defaultWidth = '700px'

		if (screens.xxl) {
			return '1000px'
		} else if (screens.xl) {
			return '800px'
		} else if (screens.lg) {
			return '700px'
		} else if (screens.md) {
			return '600px'
		} else if (screens.sm || screens.xs) {
			return '400px'
		} else {
			return defaultWidth
		}
	}

	const width = getWidth()

	return (
		<AntdModal
			className="appointment-modal"
			open
			{...modalProps}
			onCancel={() => {
				onCancelCallback?.()
				navigate('/appointments')
			}}
			width={width}
			centered
		>
			{children}
		</AntdModal>
	)
}
