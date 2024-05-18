export function isStringEmpty(str: unknown | undefined) {
	if (str === undefined) {
		return true
	}

	return String(str).trim() === ''
}
