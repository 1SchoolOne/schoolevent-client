import { ArrowLeft } from '@phosphor-icons/react'
import { Button, Col, Modal, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '@contexts'
import { TReward } from '@types'

import { useRewardData, useStudentPoints } from './ChoosingReward-utils'
import { ChoosingRewardCard } from './_components/ChoosingRewardCard/ChoosingRewardCard'

import './ChoosingRewardLayout-styles.less'
//import { useMutation } from '@tanstack/react-query'

const { Title } = Typography

export function ChoosingRewardLayout() {
	const { user } = useAuth()
	const [selectedRewards, setSelectedRewards] = useState(new Map())
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [remainingPoints, setRemainingPoints] = useState(0)

	const { data: rewards } = useRewardData()
	const { data: studentPoints } = useStudentPoints(user?.id)

	useEffect(() => {
		if(studentPoints !== undefined) {
			setRemainingPoints(studentPoints)
		}
	}, [studentPoints])

	const handleSelect = (reward: TReward) => {
		if (remainingPoints >= reward.reward_points) {
			setSelectedRewards((prev) => {
				const updatedRewards = new Map(prev)
				if (updatedRewards.has(reward.reward_name)) {
					updatedRewards.set(reward.reward_name, {
						reward,
						count: updatedRewards.get(reward.reward_name).count + 1,
					})
				} else {
					updatedRewards.set(reward.reward_name, { reward, count: 1 })
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
			if (updatedRewards.has(reward.reward_name)) {
				const currentCount = updatedRewards.get(reward.reward_name).count
				if (currentCount === 1) {
					updatedRewards.delete(reward.reward_name)
				} else {
					updatedRewards.set(reward.reward_name, {
						reward,
						count: currentCount - 1,
					})
				}
			}

			return updatedRewards
		})

		setRemainingPoints((prev) => prev + reward.reward_points)
	}


	const handleValidateSelection = () => {
		setIsModalVisible(true)
	}

	const handleCloseModal = () => {
		setIsModalVisible(false)
	}

	const getRewardSummary = () => {
		return Array.from(selectedRewards.entries()).map(([name, data]) => (
			<p key={name}>
				{name}: {data.count} fois
			</p>
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
			<div>
				<Modal
					title="Récapitulatif"
					open={isModalVisible}
					onCancel={handleCloseModal}
					footer={[
						<Button type="default" key="close" onClick={handleCloseModal}>
							Fermer
						</Button>,
						<Button type="primary">
							Confirmer
						</Button>,
					]}
				>
					{getRewardSummary()}
				</Modal>
			</div>
		</div>
	)
}
