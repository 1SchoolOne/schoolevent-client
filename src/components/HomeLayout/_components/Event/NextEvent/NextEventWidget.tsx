import { Card, Col, Row, Statistic, Typography } from 'antd'
import { useState } from 'react'

import './NextEventWidget-styles.less'

export const NextEventWidget: React.FC = () => {
	const [participationCount] = useState(134)
	const [studentCount] = useState(3)

	return (
		<Card title="Bonjour Mathieu" className={'next-event-widget'}>
			<Row>
				<Col span={8}>
					<Typography className="ant-statistic-title">Votre prochain événement est :</Typography>
					<p className="event-description">Salon avec des entrepreneurs et des patrons.</p>
				</Col>
				<Col span={8}>
					<Statistic title="Nombre provisoire de participations :" value={participationCount} />
				</Col>
				<Col span={8}>
					<Statistic
						title="Nombre d'étudiants présents :"
						value={studentCount }
					/>
				</Col>
			</Row>
		</Card>
	)
}
