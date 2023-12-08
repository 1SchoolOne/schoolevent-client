import { SignOut as SignOutIcon } from '@phosphor-icons/react'
import { Avatar, Dropdown } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'

// import { capitalize } from '@utils'

export function UserMenu() {
	const { signOut, user } = useAuth()
	const navigate = useNavigate()

	const items: ItemType[] = [
		{
			key: 'usermenu-logout',
			icon: <SignOutIcon size="1rem" />,
			label: 'Déconnexion',
			onClick: () => {
				signOut()
				navigate('/login')
			},
		},
	]

	if (!user) {
		return null
	}

	// TODO: uncomment this when we are able to use school email
	// const getName = (email: string) => {
	// 	const fullname = email.split('@').shift()!.split('.')
	// 	fullname[0] = capitalize(fullname[0])
	// 	fullname[1] = capitalize(fullname[1])

	// 	return fullname.join(' ')
	// }

	// const name = getName(user.email!)
	// const initials = name.split(' ')[0].charAt(0) + name.split(' ')[1].charAt(0)

	return (
		<Dropdown menu={{ items }}>
			<Avatar />
		</Dropdown>
	)
}
