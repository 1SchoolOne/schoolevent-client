import { ArrowLeft } from '@phosphor-icons/react'
import { Button, Col, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { TReward } from '@types'

import { useFetchRewardData } from './ChoosingReward-utils'
import { ChoosingRewardCard } from './_components/ChoosingRewardCard/ChoosingRewardCard'

import './ChoosingRewardLayout-styles.less'

const { Title } = Typography

export function ChoosingRewardLayout() {
	const [rewards, setRewards] = useState<TReward[]>([])

	useEffect(() => {
		const loadRewards = async () => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const rewards = await useFetchRewardData()
			setRewards(rewards)
		}

		loadRewards()
	}, [])
	return (
		<div className="container">
			<Link to="/rewards">
				<ArrowLeft size={16} />
				Retour
			</Link>
			<div className="choose-reward-header">
				<Title level={2}>Choisis ta récompense !</Title>
				<div className="validate-rewards">
					<Button type="primary">Valider la sélection</Button>
					<Title level={3}>
						Tes points : <span className="points">0</span>
					</Title>
				</div>
			</div>
			<div className="rewards-list">
				<Row gutter={[10, 40]}>
					{rewards.map((reward, index: number) => (
						<Col span={8} key={index}>
							<ChoosingRewardCard reward={reward}></ChoosingRewardCard>
						</Col>
					))}
				</Row>
			</div>
		</div>
	)
}
