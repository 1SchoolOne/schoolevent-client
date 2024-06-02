import { Button, Typography } from 'antd'
import './Reward-styles.less'
import { HistoricEventCell } from './_components/HistoricEventCell/HistoricEventCell'

const { Title } = Typography

export function Reward() {
  return (
    <div className="flex-container">
      <div className="reward-container">
        <Title level={2}>Convertis tes points !</Title>
        <div className="convert">
          <Title level={4}>Tes points : <span className="points">0</span></Title>
          <Button className="convert-button">Convertir</Button>
        </div>
      </div>
      <div className="historic-container">
        <Title level={2}>Historique de tes évènements</Title>
        <HistoricEventCell/>
      </div>
    </div>
  )
}