import { Helmet } from "react-helmet"
import { RouteObject } from "react-router-dom"


import { ProtectedRoute } from '@components'

export const rewardsRoute: RouteObject = {
  path: 'reward',
  element: (
    <ProtectedRoute>
      <Helmet>
        <title>SchoolEvent | Récompenses</title>
      </Helmet>
    </ProtectedRoute>
  ),
}