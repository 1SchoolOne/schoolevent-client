import { BasicLayout } from '../BasicLayout/BasicLayout'
import { AdminTable } from './_components/AdminTable/AdminTable'

export function AdminLayout() {
	return (
		<BasicLayout className="admin-layout" contentClassName="admin-layout__content">
			<AdminTable />
		</BasicLayout>
	)
}
