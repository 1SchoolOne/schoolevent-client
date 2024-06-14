import { capitalize } from '@utils'

export function getNameFromEmail(email: string) {
	const splittedEmail = email.split('@')

	if (splittedEmail[0].includes('.')) {
		const fullname = splittedEmail.shift()!.split('.')

		return formatFullnameWithHyphens(fullname as [string, string])
	} else {
		const name = capitalize(splittedEmail[0])
		return { name, initials: name.charAt(0) }
	}
}

function formatFullnameWithHyphens(strings: [string, string]): { name: string; initials: string } {
	const results: Array<string> = []
	const initials: Array<string> = []

	for (const i in strings) {
		const newString: Array<string> = []
		const str = strings[i]

		if (str.includes('-')) {
			str.split('-').forEach((substr) => newString.push(capitalize(substr)))

			if (Number(i) === 0) {
				results.push(newString.join(' '))
			} else {
				results.push(newString.join(' ').toUpperCase())
			}
		} else {
			if (Number(i) === 0) {
				results.push(capitalize(str))
			} else {
				results.push(str.toUpperCase())
			}
		}

		initials.push(results[i].charAt(0).toUpperCase())
	}

	return { name: results.join(' '), initials: initials.join('') }
}
