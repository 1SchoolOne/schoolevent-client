import { useQueryClient } from '@tanstack/react-query'
import { Button, Empty, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'

import { useHistoricRewardData, useStudentPastEventData, useStudentPoints } from './Reward-utils'
import { HistoricEventCell } from './_components/HistoricEventCell/HistoricEventCell'
import { HistoricRewardCell } from './_components/HistoricRewardCell/HistoricRewardCell'

import './Reward-styles.less'

export function Reward() {
	const { Title, Text } = Typography
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const { user } = useAuth()

	const { data: studentPastEvents } = useStudentPastEventData(user?.id)
	const { data: studentPoints } = useStudentPoints(user?.id)
	const { data: studentRewards } = useHistoricRewardData(user?.id)

	return (
		<div className="layout-container">
			<div className="left-div">
				<div className="reward-container">
					<Title level={2}>Convertis tes points !</Title>
					<div className="convert">
						<Title level={4}>
							Tes points :{' '}
							<span className="points">{studentPoints === undefined ? 0 : studentPoints}</span>
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
					<div>
						{studentPastEvents?.length === 0 ? (
							<div className="empty-section">
								<Empty description={<Text>Aucun évènement récent</Text>}>
									<Button
										onClick={() => queryClient.resetQueries({ queryKey: ['student-past-events'] })}
									>
										Actualiser
									</Button>
								</Empty>
							</div>
						) : (
							studentPastEvents?.map((event) => (
								<div>
									<HistoricEventCell event={event!} />
									<div className="divider"></div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
			<div className="right-div">
				<Title level={2}>Tes récompenses !</Title>
				<div className="historic-rewards">
					<div>
						{studentRewards?.length === 0 ? (
							<div className="empty-section">
								<Empty description={<Text>Aucune récompense récente</Text>}>
									<Button
										onClick={() => queryClient.resetQueries({ queryKey: ['student-rewards'] })}
									>
										Actualiser
									</Button>
								</Empty>
							</div>
						) : (
							studentRewards?.map((reward) => (
								<div>
									<HistoricRewardCell reward={reward} />
									<div className="divider"></div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
