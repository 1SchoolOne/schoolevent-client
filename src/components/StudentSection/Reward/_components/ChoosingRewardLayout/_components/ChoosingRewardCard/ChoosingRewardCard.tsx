import { Button, Card } from 'antd'
import classNames from 'classnames'

import { IRewardCardProps } from './ChoosingRewardCard-types'

import './ChoosingRewardCard-styles.less'

export function ChoosingRewardCard({ reward }: IRewardCardProps) {
	return (
		<Card
			className={classNames('reward-card', {
				'reward-card--has-background': !!reward.reward_background,
			})}
			data-title={reward.reward_name}	
			title={!reward.reward_background ? reward.reward_name : undefined}
			cover={
				reward.reward_background ? (
					<img className="img-cover" alt="event-cover" src={reward.reward_background} />
				) : undefined
			}
		>
			<p className="required-points">
				Valeur:
				<span className="points"> {reward.reward_points}</span> pts
			</p>
			<p className="rewards-number">
				Cartes cadeaux restantes: <span className="number">{reward.reward_number}</span>
			</p>
			<div className="select-reward">
				<Button type="primary">Sélectionner</Button>
			</div>
		</Card>
	)
}
