import { Card, Row, Col, Statistic } from 'antd';
import { valueType } from 'antd/lib/statistic/utils';
import { EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import CountUp from 'react-countup';
import './visitsWidget-styles.less';

const formatter = (value: valueType) => {
  const numberValue = Number(value);
  return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />;
};

export const VisitsWidget: React.FC = () => {
  const [visits] = useState(134);
  const [comparison] = useState(12);


  return (
    <Card title="Performances du dernier événement" size="small" bordered={true} className="visits-widget">
      <Row className="visits-widget__item">
        <Col span={2}>
          <EyeOutlined />
        </Col>
        <Col span={22}>
          <Statistic title="Nombre total de participation" value={visits} formatter={formatter} />
        </Col>
      </Row>
      <hr className="visits-widget__separator" />
      <Row className="visits-widget__item">
        <Col span={24}>
          <Statistic
            title="Comparé à l'avant-dernier événement"
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
