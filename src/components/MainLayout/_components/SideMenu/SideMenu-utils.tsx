import {
	UserCircleGear as AdminIcon,
	Briefcase as AppointmentsIcon,
	CalendarBlank as CalendarIcon,
	Coins as CoinIcon,
	UsersThree as ContactsIcon,
	Ticket as EventsIcon,
	House as HomeIcon,
	Student as StudentsIcon,
} from '@phosphor-icons/react'
import { Badge, Space } from 'antd'
import { MenuItemType } from 'antd/lib/menu/hooks/useItems'
import { Link } from 'react-router-dom'

import { Database } from '@types'

export function getActiveLink(pathname: string) {
	const path = pathname.split('/').filter((i) => i)

	if (path.length === 0) return 'menu-home'

	return `menu-${path[0]}`
}

/**
 * Returns the items for the side menu based on user role.
 */
export function getItems(params: {
	role: Database['public']['Enums']['user_role'] | null
	pendingUsers: number
}): Array<MenuItemType> {
	const { role, pendingUsers } = params

	const managerItems: Array<MenuItemType> = [
		{
			key: 'menu-home',
			icon: <HomeIcon size="1rem" />,
			label: <Link to="/">Accueil</Link>,
		},
		{
			key: 'menu-contacts',
			icon: <ContactsIcon size="1rem" />,
			label: <Link to="/contacts">Contacts</Link>,
		},
		{
			key: 'menu-calendar',
			icon: <CalendarIcon size="1rem" />,
			label: <Link to="/calendar">Calendrier</Link>,
		},
		{
			key: 'menu-appointments',
			icon: <AppointmentsIcon size="1rem" />,
			label: <Link to="/appointments">Rendez-vous</Link>,
		},
		{
			key: 'menu-events',
			icon: <EventsIcon size="1rem" />,
			label: <Link to="/events">Événements</Link>,
		},
		{
			key: 'menu-students',
			icon: <StudentsIcon size="1rem" />,
			label: <Link to="/students">Étudiants</Link>,
		},
		{
			key: 'menu-rewards',
			icon: <CoinIcon size="1rem" />,
			label: <Link to="/rewards">Récompenses</Link>,
		},
	]

	switch (role) {
		case 'student':
			return [
				{
					key: 'menu-events',
					icon: <EventsIcon size="1rem" />,
					label: <Link to="/events">Événements</Link>,
				},
				{
					key: 'menu-rewards',
					icon: <CoinIcon size="1rem" />,
					label: <Link to="/rewards">Récompenses</Link>,
				},
			]
		case 'admin':
			return [
				...managerItems,
				{
					key: 'menu-admin',
					icon: <AdminIcon size="1rem" />,
					label: (
						<Space>
							<Link to="/admin">Administration</Link>
							<Badge count={pendingUsers} size="small"></Badge>
						</Space>
					),
				},
			]
		case 'manager':
			return managerItems
		default:
			return []
	}
}
