import { getNameFromEmail } from '@utils'

test('extract successfully name and initials from email', () => {
	const email = 'john.doe@esiee-it.fr'
	const formatted = getNameFromEmail(email)

	expect(formatted.name).equals('John DOE')
	expect(formatted.initials).equals('JD')
})

test('extract successfully name and initials from complex email', () => {
	const email = 'john-junior.super-doe@esiee-it.fr'
	const formatted = getNameFromEmail(email)

	expect(formatted.name).equals('John Junior SUPER DOE')
	expect(formatted.initials).equals('JS')
})

test('extract name and initials successfully from a single name email', () => {
	const email = 'john@esiee-it.fr'
	const formatted = getNameFromEmail(email)

	expect(formatted.name).equals('John')
	expect(formatted.initials).equals('J')
})
