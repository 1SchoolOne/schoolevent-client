import { Card, Typography, Row, Col } from 'antd';
import { EyeOutlined, LineChartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './studentWidget-styles.less';

export const StudentWidget: React.FC = () => {
    const [visits] = useState(134);
    const [comparison] = useState(7);

  return (
        <Card title="Nouveaux étudiants" size="small" bordered={true} className="student-widget">
            <Row className="student-widget__item">
                <Col span={2}>
                    <EyeOutlined />
                </Col>
                <Col span={22}>
                    <Typography.Text>
                        <span className="student-widget__visits-number">{visits}</span> Étudiant
                    </Typography.Text>
                </Col>
            </Row>
            <hr className="student-widget__separator" />
          <Row className="student-widget__item">
            <Col span={24}>
              <Typography.Text>
                <LineChartOutlined />
                <span className="student-widget__comparison-number"> +{comparison}</span> Étudiant / Mois
              </Typography.Text>
            </Col>
          </Row>
        </Card>
    );
};
