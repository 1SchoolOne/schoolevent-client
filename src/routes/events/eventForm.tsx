import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { EventForm } from '@components'

export const eventFormRoute: RouteObject = {
	path: 'new',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Création d'un évenement</title>
			</Helmet>
			<EventForm />
		</>
	),
}
