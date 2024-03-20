import { Card, Typography, Row, Col, Button, Space } from 'antd';
import { EyeOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react';
import moment, { Moment } from 'moment';
import 'moment/locale/fr';
import './visitsmonthWiedget-styles.less';

moment.locale('fr');

const ICON_SPAN_SIZE = 2;
const TEXT_SPAN_SIZE = 22;

const useMonth = (initialMonth: Moment) => {
    const [month, setMonth] = useState(initialMonth);

    const handlePrevMonth = useCallback(() => {
        setMonth((prevMonth: Moment) => prevMonth.clone().subtract(1, 'month'));
    }, []);

    const handleNextMonth = useCallback(() => {
        setMonth((nextMonth: Moment) => nextMonth.clone().add(1, 'month'));
    }, []);

    return { month, handlePrevMonth, handleNextMonth };
};

export const VisitsMonthWidget: React.FC = () => {
    const [visits] = useState(78);
    const { month, handlePrevMonth, handleNextMonth } = useMonth(moment());

    return (
      <Card title="Nombre de Visiteur" size="small" bordered={true} className="visitsmonth-widget">
          <Row className="visitsmonth-widget__item">
              <Col span={ICON_SPAN_SIZE}>
                  <EyeOutlined/>
              </Col>
              <Col span={TEXT_SPAN_SIZE}>
                  <Typography.Text>
                      <span className="visitsmonth-widget__visits-number">{visits}</span> visiteur du mois
                  </Typography.Text>
              </Col>
          </Row>
          <hr className="visits-widget__separator"/>
          <Row className="visits-widget__item">
              <Col span={24}>
                  <Space className="centered-content">
                      <Button type="primary" icon={<LeftOutlined/>} onClick={handlePrevMonth}/>
                      <Typography.Text>
                          {month.format('MMMM')}
                      </Typography.Text>
                      <Button type="primary" icon={<RightOutlined/>} onClick={handleNextMonth}/>
                  </Space>
              </Col>
          </Row>
      </Card>
    );
};
