import {
	Backspace as BackspaceIcon,
	Command as CommandIcon,
	Control as ControlIcon,
	Option as OptionIcon,
	KeyReturn as ReturnIcon,
	ArrowFatUp as ShiftIcon,
	WindowsLogo as WindowsIcon,
} from '@phosphor-icons/react'
import { Typography } from 'antd'
import classNames from 'classnames'

import { IKeyboardProps } from './Keyboard-types'

import './Keyboard-styles.less'

/**
 * Use this component to show keyboard combination.
 */
export function Keyboard(props: IKeyboardProps) {
	const { className, combination } = props

	const getKeysNode = () => {
		const platform = getUserPlatform()
		const keys: React.ReactNode[] = []

		combination.forEach((key) => {
			if (key === 'backspace') {
				keys.push(
					<Typography.Text title="Retour" keyboard>
						<BackspaceIcon size={16} />
					</Typography.Text>,
				)
			} else if (key === 'ctrl') {
				platform === 'mac'
					? keys.push(
							<Typography.Text title="Control" keyboard>
								<ControlIcon size={16} />
							</Typography.Text>,
					  )
					: keys.push(
							<Typography.Text title="Ctrl" keyboard>
								<p>Ctrl</p>
							</Typography.Text>,
					  )
			} else if (key === 'super') {
				platform === 'mac' &&
					keys.push(
						<Typography.Text title="Command" keyboard>
							<CommandIcon size={16} />
						</Typography.Text>,
					)

				platform === 'windows' &&
					keys.push(
						<Typography.Text title="Windows" keyboard>
							<WindowsIcon size={16} />
						</Typography.Text>,
					)

				platform === 'linux' &&
					keys.push(
						<Typography.Text title="Super" keyboard>
							<p>Super</p>
						</Typography.Text>,
					)
			} else if (key === 'alt') {
				platform === 'mac'
					? keys.push(
							<Typography.Text title="Option" keyboard>
								<OptionIcon size={16} />
							</Typography.Text>,
					  )
					: keys.push(
							<Typography.Text title="Alt" keyboard>
								<p>alt</p>
							</Typography.Text>,
					  )
			} else if (key === 'shift') {
				keys.push(
					<Typography.Text title="Shift" keyboard>
						<ShiftIcon size={16} />
					</Typography.Text>,
				)
			} else if (key === 'return') {
				keys.push(
					<Typography.Text title="Entrer" keyboard>
						<ReturnIcon size={16} />
					</Typography.Text>,
				)
			} else {
				keys.push(
					<Typography.Text keyboard>
						<p>{key}</p>
					</Typography.Text>,
				)
			}
		})

		return keys
	}

	const keysNode = getKeysNode()

	const keys: React.ReactNode[] = []
	keysNode.forEach((key, index) => {
		keys.push(key)

		if (index < keysNode.length - 1) {
			keys.push(<p>+</p>)
		}
	})

	return <div className={classNames('keyboard', className)}>{keys}</div>
}

function getUserPlatform() {
	const platform = navigator.userAgent
	if (platform.indexOf('Mac') > -1) {
		return 'mac'
	} else if (platform.indexOf('Win') > -1) {
		return 'windows'
	} else {
		return 'linux'
	}
}
