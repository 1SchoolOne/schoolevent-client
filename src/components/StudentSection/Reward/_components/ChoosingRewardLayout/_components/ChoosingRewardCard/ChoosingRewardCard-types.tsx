import { TReward } from '@types'

export interface IRewardCardProps {
	reward: TReward
	studentPoints: number
	onSelect: (reward: TReward) => void
	onDeselect: (reward: TReward) => void
}

interface Reward extends TReward {
	claimed_at: string
	quantity: number
}

export interface IHistoricRewardCardProps {
	reward: Reward
}
