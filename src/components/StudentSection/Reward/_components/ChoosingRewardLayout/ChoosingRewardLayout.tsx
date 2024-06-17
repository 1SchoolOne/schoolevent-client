import { ArrowLeft } from '@phosphor-icons/react'
import { Col, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

import { ChoosingRewardCard } from './_components/ChoosingRewardCard/ChoosingRewardCard'

import './ChoosingRewardLayout-styles.less'

const { Title } = Typography

export function ChoosingRewardLayout() {
	return (
		<div className="container">
			<Link to="/rewards">
				<ArrowLeft size={16} />
				Retour
			</Link>
			<div className="header">
				<Title level={2}>Choisis ta récompense !</Title>
				<Title level={3}>
					Tes points : <span className="points">0</span>
				</Title>
			</div>
			<div className="rewards-list">
				<Row gutter={[16, 16]}>
					<Col span={8}>
						<ChoosingRewardCard></ChoosingRewardCard>
					</Col>
					<Col span={8}>
						<ChoosingRewardCard></ChoosingRewardCard>
					</Col>
					<Col span={8}>
						<ChoosingRewardCard></ChoosingRewardCard>
					</Col>
					<Col span={8}>
						<ChoosingRewardCard></ChoosingRewardCard>
					</Col>
				</Row>
			</div>
		</div>
	)
}
