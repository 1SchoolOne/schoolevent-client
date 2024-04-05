import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import '../../HomeLayout-styles.less'

const formatter = (value: valueType) => {
	const numberValue = Number(value)
	return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />
}

export const StudentWidget: React.FC = () => {
	const [visits] = useState(67)
	const [comparison] = useState(4)

	return (
		<Card
			title="Nombre d'inscriptions de nouveaux étudiants"
			size="small"
			bordered={false}
			className="global-widget"
		>
			<Row gutter={16}>
				<Col xs={24}>
					<Statistic
						className="margin-bottom"
						title="Nombre d'inscriptions d'étudiants :"
						value={visits}
						prefix={<UserAddOutlined />}
						formatter={formatter}
					/>
					<hr className="margin-bottom" />
					<Statistic
						title="Comparé au mois dernier :"
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
