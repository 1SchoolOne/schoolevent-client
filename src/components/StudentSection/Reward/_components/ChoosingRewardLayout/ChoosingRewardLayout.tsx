import { ArrowLeft, Gift } from '@phosphor-icons/react'
import { Button, Col, Modal, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@contexts'
import { TReward } from '@types'

import { useRewardData, useStudentPoints,useConfirmRewards } from './ChoosingReward-utils'
import { ChoosingRewardCard } from './_components/ChoosingRewardCard/ChoosingRewardCard'

import './ChoosingRewardLayout-styles.less'

//import { useMutation } from '@tanstack/react-query'

const { Title } = Typography

export function ChoosingRewardLayout() {
	const { user } = useAuth()
	const [selectedRewards, setSelectedRewards] = useState<Map<TReward, number>>(new Map())
	const [modal, contextHolder] = Modal.useModal()
	const [remainingPoints, setRemainingPoints] = useState(0)

	const { data: rewards } = useRewardData()
	const { data: studentPoints } = useStudentPoints(user?.id)
	const {mutate: confirmRewards} = useConfirmRewards()

	useEffect(() => {
		if (studentPoints !== undefined) {
			setRemainingPoints(studentPoints)
		}
	}, [studentPoints])

	const handleSelect = (reward: TReward) => {
		if (remainingPoints >= reward.reward_points) {
			setSelectedRewards((prev) => {
				const updatedRewards = new Map(prev)
				if (updatedRewards.has(reward)) {
					updatedRewards.set(reward, (updatedRewards.get(reward)?? 0) + 1)
				} else {
					updatedRewards.set(reward, 1)
				}
				return updatedRewards
			})

			setRemainingPoints((prev) => prev - reward.reward_points)
		} else {
			alert("Vous n'avez pas assez de points pour sélectionner cette récompense.")
		}
	}

	const handleDeselect = (reward: TReward) => {
		setSelectedRewards((prev) => {
			const updatedRewards = new Map(prev)
			if (updatedRewards.has(reward)) {
				const currentCount = (updatedRewards.get(reward)?? 0)
				if (currentCount === 1) {
					updatedRewards.delete(reward)
				} else {
					updatedRewards.set(reward, currentCount - 1)
				}
			}

			return updatedRewards
		})

		setRemainingPoints((prev) => prev + reward.reward_points)
	}

	const handleValidateSelection = () => {
		modal.confirm({
			title: 'Récapitulatif de tes récompenses !',
			content: getRewardSummary(),
			icon: <Gift size={25} weight="fill" />,
			okText: 'Confirmer',
			onOk: async () => {confirmRewards(selectedRewards)},
			centered: true,
			width: 400,
			footer: (_, { OkBtn, CancelBtn }) => (
				<div className="modal-footer">
					<CancelBtn />
					<OkBtn />
				</div>
			),
		})
	}

	const getRewardSummary = () => {
		return Array.from(selectedRewards.entries()).map(([reward, count]) => (
			<ul key={reward.reward_name}>
				<li>
					{reward.reward_name} - x{count}
				</li>
			</ul>
		))
	}

	return (
		<div className="container">
			<Link to="/rewards">
				<ArrowLeft size={16} />
				Retour
			</Link>
			<div className="choose-reward-header">
				<Title level={2}>Choisis ta récompense !</Title>
				<div className="validate-rewards">
					<Button type="primary" onClick={handleValidateSelection}>
						Valider la sélection
					</Button>
					{contextHolder}
					<Title level={3}>
						Tes points : <span className="points">{remainingPoints}</span>
					</Title>
				</div>
			</div>
			<div className="rewards-list">
				<Row gutter={[10, 40]}>
					{rewards?.map((reward: TReward) => (
						<Col span={8} key={reward.id}>
							<ChoosingRewardCard
								studentPoints={remainingPoints}
								reward={reward}
								onSelect={handleSelect}
								onDeselect={handleDeselect}
							/>
						</Col>
					))}
				</Row>
			</div>
		</div>
	)
}
