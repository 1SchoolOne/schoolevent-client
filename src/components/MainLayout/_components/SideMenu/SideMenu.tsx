import {
	Briefcase as AppointmentsIcon,
	CalendarBlank as CalendarIcon,
	UsersThree as ContactsIcon,
	Ticket as EventsIcon,
	House as HomeIcon,
	ChartLineUp as StatsIcon,
	Student as StudentsIcon,
} from '@phosphor-icons/react'
import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { Link, useLocation } from 'react-router-dom'

import { getActiveLink } from './SideMenu-utils'

export function SideMenu() {
	const location = useLocation()

	const activeLink = getActiveLink(location.pathname)

	const items: ItemType[] = [
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
			label: <Link to="/events">Évènements</Link>,
		},
		{
			key: 'menu-students',
			icon: <StudentsIcon size="1rem" />,
			label: <Link to="/students">Étudiants</Link>,
		},
		{
			key: 'menu-stats',
			icon: <StatsIcon size="1rem" />,
			label: <Link to="/stats">Statistiques</Link>,
		},
	]

	return <Menu items={items} theme="dark" selectedKeys={[activeLink]} />
}
