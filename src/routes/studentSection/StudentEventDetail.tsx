import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { StudentEventDetail } from '@components'

export const studentEventDetailRoute: RouteObject = {
	path: ':studentEventId',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Détail</title>
			</Helmet>
			<StudentEventDetail />
		</>
	),
}
