import { Col, Row } from 'antd'

import { BasicLayout } from '@components'

import { AppointmentsWidget } from './_components/Appointment/appointmentWidget'
import { CalendarWidget } from './_components/Calendar/calendarWidget'
import { VisitsWidget } from './_components/Event/visitsWidget'
import { VisitsMonthWidget } from './_components/Event/visitsmonthWidget'
import { FavoritesWidget } from './_components/Favorites/favoritesWidget'
import { StudentWidget } from './_components/Student/studentWidget'

import './HomeLayout-styles.less'

export function HomeLayout() {
	return (
		<BasicLayout className="home-layout" contentClassName="home-layout__content">
			<Row gutter={[16, 16]}>
				<Col span={18}>
					<AppointmentsWidget appointments={[]} />
				</Col>
				<Col span={6}>
					<FavoritesWidget />
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
					<CalendarWidget />
				</Col>
			</Row>
		</BasicLayout>
	)
}
