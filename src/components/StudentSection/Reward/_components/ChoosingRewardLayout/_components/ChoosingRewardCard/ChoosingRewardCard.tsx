import { Button, Card } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import { log } from '@utils'

import { IRewardCardProps } from './ChoosingRewardCard-types'

import './ChoosingRewardCard-styles.less'

export function ChoosingRewardCard({
	reward,
	onSelect,
	onDeselect,
	studentPoints,
}: IRewardCardProps) {
	const [selectedCount, setSelectedCount] = useState(0)
	const [remainingRewards, setRemainingRewards] = useState(reward.reward_number)

	const addReward = async () => {
		if (remainingRewards > 0) {
			if (studentPoints < reward.reward_points) {
				alert("Vous n'avez pas assez de points pour sélectionner cette récompense.")
				return
			}
			try {
				setSelectedCount(selectedCount + 1)
				setRemainingRewards(remainingRewards - 1)
				onSelect(reward)
			} catch (error) {
				log.error('Error selecting reward: ', error)
			}
		}
	}

	const removeReward = () => {
		if (selectedCount > 0) {
			try {
				setSelectedCount(selectedCount - 1)
				setRemainingRewards(remainingRewards + 1)
				onDeselect(reward)
			} catch (error) {
				log.error('Error deselecting reward: ', error)
			}
		}
	}

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
				Cartes cadeaux restantes: <span className="number">{remainingRewards}</span>
			</p>
			<div className="select-reward">
				{selectedCount > 0 && (
					<Button type="default" onClick={removeReward} style={{ marginRight: '10px' }}>
						Retirer
					</Button>
				)}
				<Button type="primary" onClick={addReward} disabled={studentPoints < reward.reward_points}>
					{selectedCount > 0 ? `Sélectionné (${selectedCount})` : 'Sélectionner'}
				</Button>
			</div>
		</Card>
	)
}
