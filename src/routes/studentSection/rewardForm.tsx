import { Helmet } from 'react-helmet'
import { RouteObject } from 'react-router-dom'

import { RewardForm } from '@components'

export const rewardFormRoute: RouteObject = {
	path: 'newReward',
	element: (
		<>
			<Helmet>
				<title>SchoolEvent | Nouvelle récompense</title>
			</Helmet>
			<RewardForm />
		</>
	),
}
