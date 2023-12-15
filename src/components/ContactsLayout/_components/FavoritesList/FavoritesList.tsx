import { Trash as DeleteIcon, MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Dropdown, Input, List, Space } from 'antd'

import { useAuth, useFavorites } from '@contexts'

import './FavoritesList-styles.less'

export function FavoritesList() {
	const { favorites, loading, deleteFavorite } = useFavorites()
	const { user } = useAuth()

	if (!user) {
		return null
	}

	return (
		<Space className="favorites-list" direction="vertical">
			<Input placeholder="Rechercher des favoris" prefix={<SearchIcon />} />
			<List
				dataSource={favorites}
				loading={loading}
				renderItem={(item) => (
					<Dropdown
						menu={{
							items: [
								{
									key: 1,
									label: 'Supprimer',
									icon: <DeleteIcon />,
									danger: true,
									onClick: () => deleteFavorite(item.id, user.id),
								},
							],
						}}
						trigger={['contextMenu']}
					>
						<List.Item key={item.id}>
							<List.Item.Meta
								className="favorites-list__item"
								title={item.name}
								description={
									<i>
										{item.city} - {item.postalCode}
									</i>
								}
							/>
						</List.Item>
					</Dropdown>
				)}
			/>
		</Space>
	)
}
