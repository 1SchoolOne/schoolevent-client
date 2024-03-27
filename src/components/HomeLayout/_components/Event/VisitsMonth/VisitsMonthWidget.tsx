import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, ConfigProvider, Row, Space, Statistic, Typography } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import { useState } from 'react'

import './VisitsMonthWidget-styles.less'

const { Title } = Typography

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
				bordered={true}
				className="visitsmonth-widget"
			>
				<Row>
					<Statistic
						className="margin-bottom"
						title="Nombre total de participations :"
						value={visits}
						prefix={<EyeOutlined />}
					/>
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
