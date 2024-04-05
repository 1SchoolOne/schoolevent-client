import { ArrowDownOutlined, ArrowUpOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import '../../HomeLayout-styles.less'

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
			bordered={false}
			className="global-small-widget"
		>
			<Row gutter={16}>
				<Col xs={24}>
					<Statistic
						className="margin-bottom"
						title="Nombre total de participations :"
						value={visits}
						prefix={<EyeOutlined />}
						formatter={formatter}
					/>
					<Statistic
						className="margin-bottom"
						title="Appréciation sur le dernier événement :"
						value={appreciationCount}
						prefix={<LikeOutlined />}
						suffix="%"
						formatter={formatter}
					/>
					<Statistic
						title="Participation comparée à l'avant-dernier événement :"
						value={comparison}
						prefix={comparison > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
						suffix="%"
						formatter={formatter}
					/>
				</Col>
			</Row>
		</Card>
	)
}
