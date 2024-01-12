import { Helmet } from 'react-helmet'
import { Outlet, RouteObject } from 'react-router-dom'

import { eventFormRoute } from '@routes'

export const eventsRoute: RouteObject = {
	path: 'events',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Évènements</title>
			</Helmet>
			<Outlet />
		</>
	),
	children: [eventFormRoute],
}
