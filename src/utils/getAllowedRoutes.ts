import { Database } from '@types'

/**
 * Returns allowed routes based on user role.
 */
export function getAllowedRoutes(role: Database['public']['Enums']['user_role']) {
	const managerRoutes = ['appointments', 'calendar', 'contacts', 'events', 'students', 'rewards']
	switch (role) {
		case 'admin':
			return [...managerRoutes, 'admin']
		case 'manager':
			return managerRoutes
		case 'student':
			return ['events', 'rewards']
	}
}
