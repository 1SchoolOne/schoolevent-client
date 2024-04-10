import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { EventDetail } from '../../components/events/EventDetail/EventDetail'

export const eventDetailRoute: RouteObject = {
	path: ':eventId',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Détail d'un évenement</title>
			</Helmet>
			<EventDetail />
		</>
	),
}
