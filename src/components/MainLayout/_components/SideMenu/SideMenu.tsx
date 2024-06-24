import { useQuery } from '@tanstack/react-query'
import { Menu } from 'antd'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import { getActiveLink, getItems } from './SideMenu-utils'

export function SideMenu() {
	const location = useLocation()
	const { role } = useAuth()
	const supabase = useSupabase()

	const { data: pendingUsers } = useQuery({
		queryKey: ['pending-users-count'],
		queryFn: async () => {
			const { error, count } = await supabase
				.from('users')
				.select('*', { count: 'exact', head: true })
				.eq('approved', false)

			if (error) {
				throw error
			}

			return count
		},
		enabled: role === 'admin',
	})

	const items = useMemo(
		() => getItems({ role, pendingUsers: pendingUsers ?? 0 }),
		[role, pendingUsers],
	)

	if (!role) return null

	const activeLink = getActiveLink(location.pathname)

	return <Menu items={items} theme="dark" selectedKeys={[activeLink]} />
}
