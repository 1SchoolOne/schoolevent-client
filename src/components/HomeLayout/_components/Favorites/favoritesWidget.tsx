import { Card, Col, List, Row } from 'antd'

import { useFavorites } from '@contexts'

import '../../HomeLayout-styles.less'
import './favoritesWidget-styles.less'

export const FavoritesWidget: React.FC = () => {
	const { favorites } = useFavorites()
	const firstThreeFavorites = favorites.slice(0, 2)
	const nextThreeFavorites = favorites.slice(2, 4)

	return (
		<Card
			title="Dernières écoles mises en favoris"
			size="small"
			bordered={false}
			className="global-little-widget"
		>
			<Row gutter={16}>
				<Col xs={24} sm={12}>
					<List
						className="favorites-widget__list"
						locale={{
							emptyText: 'Aucun favoris',
						}}
						dataSource={firstThreeFavorites}
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
				</Col>
				<Col xs={24} sm={12}>
					<List
						className="favorites-widget__list"
						locale={{
							emptyText: 'Aucun favoris',
						}}
						dataSource={nextThreeFavorites}
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
				</Col>
			</Row>
		</Card>
	)
}
