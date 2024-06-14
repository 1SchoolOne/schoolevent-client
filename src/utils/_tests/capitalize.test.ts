import { describe, it } from 'vitest'

import { capitalize } from '@utils'

const testData = [
	{ title: 'capitalize successfully a one word string', args: 'hello', expected: 'Hello' },
	{
		title: 'capitalize successfully a string containg several words',
		args: "hello world! i'm jeff",
		expected: "Hello world! i'm jeff",
	},
	{
		title: 'capitalize successfully an uppercase string',
		args: 'HELLO world!',
		expected: 'HELLO world!',
	},
]

describe('capitalize()', () => {
	testData.forEach(({ title, args, expected }) => {
		it(title, () => {
			expect(capitalize(args)).equals(expected)
		})
	})
})
