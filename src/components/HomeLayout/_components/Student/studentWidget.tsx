import { ArrowDownOutlined, ArrowUpOutlined, UserAddOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import './StudentWidget-styles.less'

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
			bordered={true}
			className="student-widget"
		>
			<Row className="student-widget__item">
				<Statistic
					className="margin-bottom"
					title="Nombre d'inscriptions d'étudiants :"
					value={visits}
					prefix={<UserAddOutlined />}
				/>
			</Row>
			<hr className="student-widget__separator margin-bottom" />
			<Row className="student-widget__item">
				<Col span={24}>
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
