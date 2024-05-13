import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { EventUpdateForm } from '../../components/Events/EventUpdate/EventUpdateForm'

export const eventFormRoute: RouteObject = {
	path: '/event/update/:eventId',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Mise à jour d'un évenement</title>
			</Helmet>
			<EventUpdateForm />
		</>
	),
}
