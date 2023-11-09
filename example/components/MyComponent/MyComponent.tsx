import { Card } from 'antd'
import React from 'react'

import { IMyComponentProps } from './MyComponent-types'

import './MyComponent-styles.less'

export function MyComponent(props: IMyComponentProps) {
	const { title } = props

	return (
		<Card className="my-component" title={title}>
			<p>MyComponent</p>
		</Card>
	)
}
