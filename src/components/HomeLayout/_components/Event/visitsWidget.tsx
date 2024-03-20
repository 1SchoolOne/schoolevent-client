import { Card, Typography, Row, Col } from 'antd';
import { EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './visitsWidget-styles.less';

export const VisitsWidget: React.FC = () => {
    const [visits] = useState(66);
    const [comparison] = useState(19);

    return (
        <Card title="Nombre de vue sur le dernier événement " size="small" bordered={true} className="visits-widget">
            <Row className="visits-widget__item">
                <Col span={2}>
                    <EyeOutlined />
                </Col>
                <Col span={22}>
                    <Typography.Text>
                        <span className="visits-widget__visits-number">{visits}</span> nombre de vues
                    </Typography.Text>
                </Col>
            </Row>
            <hr className="visits-widget__separator" />
            <Row className="visits-widget__item">
                <Col span={24}>
                    <Typography.Text>
                      <LineChartOutlined />
                        <span className="visits-widget__comparison-number"> +{comparison}</span> Comparer au avant-dernier événement
                    </Typography.Text>
                </Col>
            </Row>
        </Card>
    );
};
