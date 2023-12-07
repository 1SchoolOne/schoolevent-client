import { Layout } from 'antd'

import { FavoritesList, Table } from './_components'

import './ContactsLayout-styles.less'

const { Content, Header, Sider } = Layout

export function ContactsLayout() {
	return (
		<Layout className="contacts-layout">
			<Header>Search, filters, sorting...</Header>
			<Layout>
				<Sider width={250}>
					<FavoritesList />
				</Sider>
				<Content>
					<Table />
				</Content>
			</Layout>
		</Layout>
	)
}
