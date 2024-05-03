import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { StudentDetail } from '../../components/StudentSection/StudentEventDetail/StudentEventDetail'

export const studentEventDetailRoute: RouteObject = {
	path: ':studentEventId',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Détail</title>
			</Helmet>
			<StudentDetail />
		</>
	),
}