import { Card, List } from 'antd'

import { useFavorites } from '@contexts'

import '../../HomeLayout-styles.less'
import './FavoritesWidget-styles.less'

export const FavoritesWidget: React.FC = () => {
	const { favorites } = useFavorites()
	const firstFourFavorites = favorites.slice(0, 3)

	return (
		<Card
			title="Dernières écoles mises en favoris"
			size="small"
			bordered={false}
			className="global-bottom-widget"
		>
			<List
				className="favorites-widget__list"
				locale={{
					emptyText: 'Aucun favoris',
				}}
				dataSource={firstFourFavorites}
				renderItem={(item) => (
					<List.Item key={item.id}>
						<List.Item.Meta
							className="favorites-widget__item"
							title={item.school_name}
							description={`${item.school_city} - ${item.school_postal_code}`}
						/>
					</List.Item>
				)}
			/>
		</Card>
	)
}
