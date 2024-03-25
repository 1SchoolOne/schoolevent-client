import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, ConfigProvider, Row, Space, Statistic, Typography } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import './visitsmonthWidget-styles.less'

const { Title } = Typography

const formatter = (value: valueType) => {
	const numberValue = Number(value)
	return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />
}

export const VisitsMonthWidget: React.FC = () => {
	const [visits] = useState(334)
	const [currentMonth, setCurrentMonth] = useState(new Date())

	const nextMonth = () => {
		setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
	}

	const prevMonth = () => {
		setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
	}

	return (
		<ConfigProvider locale={frFR}>
			<Card
				title="Nombre de participation par mois"
				size="small"
				bordered={true}
				className="visitsmonth-widget"
			>
				<Row>
					<Col span={2}>
						<EyeOutlined />
					</Col>
					<Col span={22}>
						<Statistic
							title="Nombre total de participation du mois"
							value={visits}
							formatter={formatter}
						/>
					</Col>
				</Row>
				<hr />
				<Row justify="center" align="middle">
					<Space size="large" align="center">
						<Button icon={<LeftOutlined />} onClick={prevMonth} />
						<Title level={4}>{currentMonth.toLocaleString('fr-FR', { month: 'long' })}</Title>
						<Button icon={<RightOutlined />} onClick={nextMonth} />
					</Space>
				</Row>
			</Card>
		</ConfigProvider>
	)
}
