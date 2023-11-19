export function getActiveLink(pathname: string) {
	const path = pathname.split('/').filter((i) => i)

	if (path.length === 0) return 'menu-home'

	return `menu-${path[0]}`
}
