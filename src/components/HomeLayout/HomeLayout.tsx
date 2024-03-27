import { Col, Row } from 'antd'

import { BasicLayout } from '@components'

import { AppointmentsWidget } from './_components/Appointment/AppointmentWidget'
import { CalendarWidget } from './_components/Calendar/CalendarWidget'

import { NextEventWidget } from './_components/Event/NextEvent/NextEventWidget'
import { VisitsWidget } from './_components/Event/Visits/VisitsWidget'
import { VisitsMonthWidget } from './_components/Event/VisitsMonth/VisitsMonthWidget'

import { FavoritesWidget } from './_components/Favorites/FavoritesWidget'
import { StudentWidget } from './_components/Student/StudentWidget'

import './HomeLayout-styles.less'

export function HomeLayout() {
	return (
		<BasicLayout className="home-layout" contentClassName="home-layout__content">
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<NextEventWidget />
				</Col>
				<Col span={18}>
					<AppointmentsWidget appointments={[]} />
				</Col>
				<Col span={6}>
					<CalendarWidget />
				</Col>
				<Col span={6}>
					<VisitsWidget />
				</Col>
				<Col span={6}>
					<VisitsMonthWidget />
				</Col>
				<Col span={6}>
					<StudentWidget />
				</Col>
				<Col span={6}>
					<FavoritesWidget />
				</Col>
			</Row>
		</BasicLayout>
	)
}
