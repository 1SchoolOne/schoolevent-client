import { TReward } from "@types"

export interface IRewardCardProps {
  reward: TReward,
  studentPoints: number,
  onSelect: (reward: TReward) => void,
  onDeselect: (reward: TReward) => void,
}

export interface IHistoricRewardCardProps {
  reward: TReward
}