import { Helmet } from 'react-helmet'
import { Outlet, RouteObject } from 'react-router-dom'

import { ProtectedRoute } from '@components'

import { StudentEventList } from '../../components/StudentSection/StudentEventsList/StudentEventsList'

export const studentEventRoute: RouteObject = {
	path: 'studentEvents',
	element: (
		<ProtectedRoute>
			<Helmet>
				<title>SchoolEvent | Évènements</title>
			</Helmet>
			<StudentEventList />
			<Outlet />
		</ProtectedRoute>
	),
}