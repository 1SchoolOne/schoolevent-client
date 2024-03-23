import { BasicLayout } from '@components';
import { Col, Row } from 'antd';
import './HomeLayout-styles.less'

import { FavoritesWidget } from './_components/Favorites/favoritesWidget';

import { AppointmentsWidget } from './_components/Appointment/appointmentWidget';

import { VisitsWidget } from './_components/Event/visitsWidget';
import { VisitsMonthWidget } from './_components/Event/visitsmonthWidget';

import { StudentWidget } from './_components/Student/studentWidget';

import { CalendarWidget } from './_components/Calendar/calendarWidget';

export function HomeLayout() {
    return (
        <BasicLayout
            className="home-layout"
            contentClassName="home-layout__content"
        >
            <Row gutter={16}>
                <Col span={16}>
                    <AppointmentsWidget appointments={[]} />
                </Col>
                <Col span={8}>
                    <FavoritesWidget />
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

            </Row>
        </BasicLayout>
    )
}
