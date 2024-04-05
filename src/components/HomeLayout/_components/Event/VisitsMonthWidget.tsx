import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, ConfigProvider, Row, Space, Statistic, Typography } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import { valueType } from 'antd/lib/statistic/utils'
import { useState } from 'react'
import CountUp from 'react-countup'

import '../../HomeLayout-styles.less'

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
				title="Nombre de participations par mois"
				size="small"
				bordered={false}
				className="global-widget"
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
						<hr />
						<Row justify="center" align="middle">
							<Space size="large" align="center">
								<Button icon={<LeftOutlined />} onClick={prevMonth} />
								<Title level={4}>{currentMonth.toLocaleString('fr-FR', { month: 'long' })}</Title>
								<Button icon={<RightOutlined />} onClick={nextMonth} />
							</Space>
						</Row>
					</Col>
				</Row>
			</Card>
		</ConfigProvider>
	)
}
