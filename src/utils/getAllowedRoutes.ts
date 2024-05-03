import { Database } from '@types'

/**
 * Returns allowed routes based on user role.
 */
export function getAllowedRoutes(role: Database['public']['Enums']['user_role']) {
	switch (role) {
		case 'admin':
		case 'manager':
			return ['appointments', 'calendar', 'contacts', 'events', 'students']
		case 'student':
			return ['studentEvents', 'reward']
	}
}
