import { ArrowLeft } from '@phosphor-icons/react'
import { Card, Col, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

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
			<Row>
				<Col span={8}>
					<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
						}
					></Card>
				</Col>
				<Col span={8}>
				<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
						}
					></Card>
				</Col>
				<Col span={8}>
				<Card
						hoverable
						style={{ width: 240 }}
						cover={
							<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
						}
					></Card>
				</Col>
			</Row>
		</div>
	)
}
