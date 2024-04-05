import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic, Typography } from 'antd'
import { useState } from 'react'

import '../../HomeLayout-styles.less'

export const NextEventWidget: React.FC = () => {
	const [participationCount] = useState(134)
	const [studentCount] = useState(3)

	return (
		<Card title="Bonjour Mathieu" className={'global-widget'}>
			<Row gutter={16}>
				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Typography className="ant-statistic-title">Votre prochain événement est :</Typography>
					<p className="event-description">Salon avec des entrepreneurs et des patrons.</p>
				</Col>
				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Statistic
						title="Nombre provisoire de participations :"
						value={participationCount}
						prefix={<UserOutlined />}
					/>
				</Col>
				<Col xs={24} sm={24} md={8} lg={8} xl={8}>
					<Statistic
						title="Nombre d'étudiants présents :"
						value={studentCount}
						prefix={<TeamOutlined />}
					/>
				</Col>
			</Row>
		</Card>
	)
}
