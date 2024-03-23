import { Card, Flex, List } from 'antd'

import { useFavorites } from '@contexts'

import './favoritesWidget-styles.less'

export const FavoritesWidget: React.FC = () => {
	const { favorites } = useFavorites()
	const firstFourFavorites = favorites.slice(0, 4)

	return (
		<Card title="Écoles favorites" size="small" bordered={true} className="favorites-widget">
			<div>
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
								description={
									<Flex justify="space-between">
										<i>
											{item.school_city} - {item.school_postal_code}
										</i>
									</Flex>
								}
							/>
						</List.Item>
					)}
				/>
			</div>
		</Card>
	)
}
