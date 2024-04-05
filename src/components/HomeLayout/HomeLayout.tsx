import { Col, Row } from 'antd'

import { BasicLayout } from '@components'

import { AppointmentsWidget } from './_components/Appointment/AppointmentWidget'
import { CalendarWidget } from './_components/Calendar/CalendarWidget'
import { NextEventWidget } from './_components/Event/NextEventWidget'
import { VisitsMonthWidget } from './_components/Event/VisitsMonthWidget'
import { VisitsWidget } from './_components/Event/VisitsWidget'
import { FavoritesWidget } from './_components/Favorites/FavoritesWidget'
import { StudentWidget } from './_components/Student/StudentWidget'

import './HomeLayout-styles.less'

export function HomeLayout() {
	const widgets = [
		{ component: <NextEventWidget />, xs: 24, md: 24 },
		{ component: <AppointmentsWidget appointments={[]} />, xs: 24, md: 18 },
		{ component: <CalendarWidget />, xs: 24, md: 6 },
		{ component: <VisitsWidget />, xs: 24, sm: 12, md: 6 },
		{ component: <VisitsMonthWidget />, xs: 24, sm: 12, md: 6 },
		{ component: <StudentWidget />, xs: 24, sm: 12, md: 6 },
		{ component: <FavoritesWidget />, xs: 24, sm: 12, md: 6 },
	]

	return (
		<BasicLayout className="home-layout" contentClassName="ant-layout-content">
			<Row gutter={[16, 16]}>
				{widgets.map((widget, index) => (
					<Col key={index} xs={widget.xs} sm={widget.sm} md={widget.md}>
						{widget.component}
					</Col>
				))}
			</Row>
		</BasicLayout>
	)
}
