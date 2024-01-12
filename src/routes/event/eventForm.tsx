import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { EventForm } from '../../components/EventForm/EventForm'

export const eventFormRoute: RouteObject = {
	path: '/eventForm',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Création d'un évenement</title>
			</Helmet>
			<EventForm />
		</>
	),
}
