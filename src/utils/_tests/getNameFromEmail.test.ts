import { getNameFromEmail } from '@utils'

test('extract successfully name and initials from email', () => {
	const email = 'john.doe@esiee-it.fr'
	const formatted = getNameFromEmail(email)

	expect(formatted.name).equals('John DOE')
	expect(formatted.initials).equals('JD')
})
