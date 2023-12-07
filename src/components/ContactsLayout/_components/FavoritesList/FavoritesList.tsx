import { MagnifyingGlass as SearchIcon } from '@phosphor-icons/react'
import { Input, List, Space } from 'antd'

import './FavoritesList-styles.less'

export function FavoritesList() {
	// Until we have a real data source, we use this mock data
	const dataSource = [
		{
			school: 'ESIEE-IT',
			city: 'Pontoise',
			postalCode: '95000',
		},
		{
			school: 'ESCP',
			city: 'Paris',
			postalCode: '75015',
		},
	]

	return (
		<Space className="favorites-list" direction="vertical">
			<Input placeholder="Rechercher des favoris" prefix={<SearchIcon />} />
			<List
				dataSource={dataSource}
				renderItem={(item) => (
					<List.Item>
						<List.Item.Meta
							className="favorites-list__item"
							title={item.school}
							description={
								<i>
									{item.city} - {item.postalCode}
								</i>
							}
						/>
					</List.Item>
				)}
			/>
		</Space>
	)
}
