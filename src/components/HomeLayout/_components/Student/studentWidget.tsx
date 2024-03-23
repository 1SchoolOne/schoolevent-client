import { Card, Row, Col, Statistic } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import { EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CountUp from 'react-countup';
import './studentWidget-styles.less';

const formatter = (value: valueType) => {
  const numberValue = Number(value);
  return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />;
};

export const StudentWidget: React.FC = () => {
  const [visits] = useState(67);
  const [comparison] = useState(4);


  return (
    <Card title="Inscriptions des nouveaux étudiants" size="small" bordered={true} className="student-widget">
      <Row className="student-widget__item">
        <Col span={2}>
          <EyeOutlined />
        </Col>
        <Col span={22}>
          <Statistic title="Nombre total de nouveaux étudiants" value={visits} formatter={formatter} />
        </Col>
      </Row>
      <hr className="student-widget__separator" />
      <Row className="student-widget__item">
        <Col span={24}>
          <Statistic
            title="Comparé au mois dernier"
            value={comparison}
            formatter={formatter}
            prefix={comparison > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            valueStyle={{ color: comparison > 0 ? '#3f8600' : '#cf1322' }}
            suffix="%"
          />
        </Col>
      </Row>
    </Card>
  );
};
