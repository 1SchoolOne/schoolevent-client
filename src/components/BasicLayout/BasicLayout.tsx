import { Layout } from 'antd'
import classNames from 'classnames'

import { IBasicLayoutProps } from './BasicLayout-types'

import './BasicLayout-styles.less'

const { Content, Header, Sider } = Layout

export function BasicLayout(props: IBasicLayoutProps) {
	const {
		children,
		className,
		contentClassName,
		header,
		headerClassName,
		siderClassName,
		sider,
		siderWidth = 250,
	} = props

	return (
		<Layout className={classNames('basic-layout', className)}>
			{sider && (
				<Sider className={classNames('basic-layout__sider', siderClassName)} width={siderWidth}>
					{sider}
				</Sider>
			)}
			{header ? (
				<Layout>
					{
						<Header className={classNames('basic-layout__header', headerClassName)}>
							{header}
						</Header>
					}
					<Content className={classNames('basic-layout__content', contentClassName)}>
						{children}
					</Content>
				</Layout>
			) : (
				<Content className={classNames('basic-layout__content', contentClassName)}>
					{children}
				</Content>
			)}
		</Layout>
	)
}
