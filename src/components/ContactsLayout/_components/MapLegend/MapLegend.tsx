import { MapPin } from '@phosphor-icons/react'
import { Space, Typography } from 'antd'

export function MapLegend() {
	return (
		<Space className="map-container__legend" direction="vertical" size={2}>
			<div className="map-container__legend__item">
				<MapPin size={20} weight="fill" color="#4798d0" stroke="black" strokeWidth={10} />
				<Typography.Text>Votre position</Typography.Text>
			</div>
			<div className="map-container__legend__item">
				<MapPin size={20} weight="fill" color="#fcd6a4" stroke="black" strokeWidth={10} />
				<Typography.Text>Collège</Typography.Text>
			</div>
			<div className="map-container__legend__item">
				<MapPin size={20} weight="fill" color="#e34336" stroke="black" strokeWidth={10} />
				<Typography.Text>Lycée</Typography.Text>
			</div>
		</Space>
	)
}
