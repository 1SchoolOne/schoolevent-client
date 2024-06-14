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
		expected: ['appointments', 'calendar', 'contacts', 'events', 'students'],
	},
	{
		title: 'returns the correct allowed routes for an admin',
		args: 'admin',
		expected: ['appointments', 'calendar', 'contacts', 'events', 'students'],
	},
] as const

describe('getAllowedRoutes()', () => {
	testData.forEach(({ title, args, expected }) => {
		it(title, () => {
			expect(getAllowedRoutes(args)).to.deep.eq(expected)
		})
	})
})
