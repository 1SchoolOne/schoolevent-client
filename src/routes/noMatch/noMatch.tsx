import { Navigate, RouteObject } from 'react-router-dom'

export const noMatchRoute: RouteObject = {
	path: '*',
	element: <Navigate to="/" />,
}
