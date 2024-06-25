import { BasicLayout } from '../BasicLayout/BasicLayout'
import { AdminTable } from './_components/AdminTable/AdminTable'

import './AdminLayout-styles.less'

export function AdminLayout() {
	return (
		<BasicLayout className="admin-layout" contentClassName="admin-layout__content">
			<AdminTable />
		</BasicLayout>
	)
}
