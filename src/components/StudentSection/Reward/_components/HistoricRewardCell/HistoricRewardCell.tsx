import { Typography } from 'antd'

import './HistoricRewardCell-styles.less'

//<img className="img-cover" alt="event-cover" src={reward.reward_background} />

export function HistoricRewardCell() {
	const { Text } = Typography

	return (
		<div className="reward-cell">
			<div className="brand-logo"></div>
			<div className="reward-infos">
				<div className="header">
					<p className="brand-name">Nom</p>
					<p>Date de sélection</p>
				</div>
				<div className="reward-value-and-selected">
					<Text>
						Valeur: <span className="points">30</span> pts
					</Text>
					<Text>Sélectionnés: x 5</Text>
				</div>
			</div>
		</div>
	)
}
