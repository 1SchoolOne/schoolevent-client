import { TReward } from "@types"

export interface IRewardCardProps {
  reward: TReward,
  studentPoints: number,
  onSelect: (reward: any) => void,
  onDeselect: (reward: any) => void,
}