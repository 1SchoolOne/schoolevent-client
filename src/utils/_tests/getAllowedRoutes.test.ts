import { describe, it } from 'vitest'

import { getAllowedRoutes } from '@utils'

const testData = [
	{
		title: 'returns the correct allowed routes for a student',
		args: 'student',
		expected: ['events', 'rewards'],
	},
	{
		title: 'returns the correct allowed routes for a manager',
		args: 'manager',
		expected: ['appointments', 'calendar', 'contacts', 'events', 'students', 'rewards'],
	},
	{
		title: 'returns the correct allowed routes for an admin',
		args: 'admin',
		expected: ['appointments', 'calendar', 'contacts', 'events', 'students', 'rewards', 'admin'],
	},
] as const

describe('getAllowedRoutes()', () => {
	testData.forEach(({ title, args, expected }) => {
		it(title, () => {
			expect(getAllowedRoutes(args)).to.deep.eq(expected)
		})
	})
})
