import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@contexts'
import { PropsWithChildren } from '@types'
import { getAllowedRoutes } from '@utils'

export function ProtectedRoute({ children }: PropsWithChildren): React.ReactElement {
	const { role } = useAuth()
	const location = useLocation()

	if (!role) return <></>

	const pathname = location.pathname.split('/').filter((i) => i)
	const allowedRoutes = getAllowedRoutes(role)

	if (!allowedRoutes.includes(pathname[0])) {
		if (role === 'student') {
			// Students should not have access to the dashboard
			return <Navigate to="/events" />
		} else if (location.pathname !== '/') {
			// If the current path equals "/", when parsed it will return undefined and
			// therefore won't be seen as an allowed route.
			// That is why we redirect only if the current path is different from "/".
			return <Navigate to="/" />
		}
	}

	return <>{children}</>
}
