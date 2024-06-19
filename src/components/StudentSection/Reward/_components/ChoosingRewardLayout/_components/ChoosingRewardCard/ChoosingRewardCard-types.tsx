import { TReward } from "@types"

export interface IRewardCardProps {
  reward: TReward,
  userId: string,
  onSelect: (reward: any) => void,
  onDeselect: (reward: any) => void,
}