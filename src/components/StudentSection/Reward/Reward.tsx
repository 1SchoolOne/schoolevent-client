import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { HistoricEventCell } from './_components/HistoricEventCell/HistoricEventCell'

import './Reward-styles.less'

export function Reward() {
	const { Title } = Typography
	const navigate = useNavigate()

	return (
		<div className="layout-container">
			<div className="left-div">
				<div className="reward-container">
					<Title level={2}>Convertis tes points !</Title>
					<div className="convert">
						<Title level={4}>
							Tes points : <span className="points">0</span>
						</Title>
						<Button
							className="convert-button"
							type="primary"
							onClick={() => {
								navigate(`/rewards/chooseReward`)
							}}
						>
							Convertir
						</Button>
					</div>
				</div>
				<div className="historic-container">
					<Title level={2}>Historique de tes évènements</Title>
					<HistoricEventCell />
				</div>
			</div>
			<div className="right-div">
				<div className="historic-rewards">
				<Title level={2}>Tes récompenses !</Title>
				</div>
			</div>
		</div>
	)
}
