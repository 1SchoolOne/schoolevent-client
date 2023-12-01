import { Layout } from 'antd'

import './ContactsLayout-styles.less'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	return (
		<Layout className="contacts-layout">
			<Sider>Favoris</Sider>
			<Layout>
				<Header>Search, filters, sorting...</Header>
				<Content>Table and map</Content>
			</Layout>
		</Layout>
	)
}
