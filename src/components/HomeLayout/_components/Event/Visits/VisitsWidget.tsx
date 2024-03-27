import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import './VisitsWidget-styles.less'

const formatter = (value: valueType) => {
	const numberValue = Number(value)
	return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />
}

export const VisitsWidget: React.FC = () => {
	const [visits] = useState(134)
	const [comparison] = useState(13)
	const [appreciationCount] = useState(64)

	return (
		<Card
			title="Performances du dernier événement"
			size="small"
			bordered={true}
			className="visits-widget"
		>
			<Row className="visits-widget__item">
				<Statistic
					className="margin-bottom"
					title="Nombre total de participations :"
					value={visits}
					prefix={<EyeOutlined />}
				/>
				<Statistic
					className="margin-bottom"
					title="Appréciation sur le dernier événement :"
					value={appreciationCount}
					prefix={<LikeOutlined />}
					suffix="%"
				/>
			</Row>
			<hr className="visits-widget__separator margin-bottom" />
			<Row className="visits-widget__item">
				<Col span={24}>
					<Statistic
						title="Participation comparée à l'avant-dernier événement :"
						value={comparison}
						formatter={formatter}
						prefix={comparison > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
						valueStyle={{ color: comparison > 0 ? '#3f8600' : '#cf1322' }}
						suffix="%"
					/>
				</Col>
			</Row>
		</Card>
	)
}
