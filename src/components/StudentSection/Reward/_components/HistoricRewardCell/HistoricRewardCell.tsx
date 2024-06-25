import { Typography } from 'antd'

import { IHistoricRewardCardProps } from '../ChoosingRewardLayout/_components/ChoosingRewardCard/ChoosingRewardCard-types'

import './HistoricRewardCell-styles.less'
import { useRewardClaimingDate, useRewardQuantity } from '../../Reward-utils'
import { getEventDateTime } from '@utils'


export function HistoricRewardCell({ reward }: IHistoricRewardCardProps) {
	const { Text } = Typography

	const { data: quantity } = useRewardQuantity(reward.id)
	const { data: claimedAt } = useRewardClaimingDate(reward.id)

	return (
		<div className="reward-cell">
			<div className="brand-logo">
				{reward.reward_background ? (
					<img className="img-cover" alt="event-cover" src={reward.reward_background} />
				) : undefined}
			</div>
			<div className="reward-infos">
				<div className="header">
					<p className="brand-name">{reward.reward_name}</p>
					<p>Réclamé le: {`${getEventDateTime(claimedAt)}`}</p>
				</div>
				<div className="reward-value-and-selected">
					<Text>
						Valeur: <span className="points">{reward.reward_points}</span> pts
					</Text>
					<Text>Sélectionnés: x{quantity}</Text>
				</div>
			</div>
		</div>
	)
}
