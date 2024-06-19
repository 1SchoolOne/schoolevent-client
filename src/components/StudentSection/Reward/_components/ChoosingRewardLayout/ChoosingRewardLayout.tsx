import { ArrowLeft } from '@phosphor-icons/react'
import { Button, Col, Modal, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { TReward } from '@types'

import { useAddRewardSelection, useFetchRewardData, useFetchRewardSelections } from './ChoosingReward-utils'
import { ChoosingRewardCard } from './_components/ChoosingRewardCard/ChoosingRewardCard'

import './ChoosingRewardLayout-styles.less'

const { Title } = Typography

export function ChoosingRewardLayout() {
	const [rewards, setRewards] = useState<TReward[]>([])
	const [selectedRewards, setSelectedRewards] = useState<{
		[key: string]: { reward: TReward; count: number }
	}>({})
	const [isModalVisible, setIsModalVisible] = useState(false)
	const userId = 'USER_ID'

	useEffect(() => {
		const loadRewards = async () => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const rewards = await useFetchRewardData()
			setRewards(rewards)

			// eslint-disable-next-line react-hooks/rules-of-hooks
			const selections = await useFetchRewardSelections(userId)
			const selectionMap = selections.reduce((acc: any, { reward_id, quantity }: any) => {
				const reward = rewards.find((r) => r.id === reward_id)
				if (reward) {
					acc[reward.reward_name] = { reward, count: quantity }
				}
				return acc
			}, {})

			setSelectedRewards(selectionMap)
		}

		loadRewards()
	}, [])

	const handleSelect = (reward: TReward) => {
		setSelectedRewards((prev) => {
			const updatedRewards = { ...prev }
			if (updatedRewards[reward.reward_name]) {
				updatedRewards[reward.reward_name].count += 1
			} else {
				updatedRewards[reward.reward_name] = { reward, count: 1 }
			}
			return updatedRewards
		})
	}

	const handleDeselect = (reward: TReward) => {
		setSelectedRewards((prev) => {
			const updatedRewards = { ...prev }
			if (updatedRewards[reward.reward_name]) {
				updatedRewards[reward.reward_name].count -= 1
				if (updatedRewards[reward.reward_name].count === 0) {
					delete updatedRewards[reward.reward_name]
				}
			}
			return updatedRewards
		})
	}

	const handleValidateSelection = () => {
		setIsModalVisible(true)
	}

	const handleCloseModal = () => {
		setIsModalVisible(false)
	}

	const confirmSelection = async () => {
		try {
			for(const key in selectedRewards) {
				const { reward, count } = selectedRewards[key]
				for (let i = 0; i < count; i++) {
					// eslint-disable-next-line react-hooks/rules-of-hooks
					await useAddRewardSelection(userId, reward.id)
				}
			}
			setSelectedRewards({})
			setIsModalVisible(false)
		} catch (error) {
			console.error("Error confirming selection: ", error)
		}
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
						Tes points : <span className="points">0</span>
					</Title>
				</div>
			</div>
			<div className="rewards-list">
				<Row gutter={[10, 40]}>
					{rewards.map((reward, index: number) => (
						<Col span={8} key={index}>
							<ChoosingRewardCard
								reward={reward}
								userId={userId}
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
						<Button type="primary" onClick={confirmSelection}>
							Confirmer
						</Button>,
					]}
				>
					<ul>
						{Object.keys(selectedRewards).map((key) => (
							<li key={key}>
								{selectedRewards[key].reward.reward_name} - x{selectedRewards[key].count}
							</li>
						))}
					</ul>
				</Modal>
			</div>
		</div>
	)
}
