import { Button, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'
import { TEvent } from '@types'

import { useFetchStudentPastEventData } from './Reward-utils'
import { HistoricEventCell } from './_components/HistoricEventCell/HistoricEventCell'
import { HistoricRewardCell } from './_components/HistoricRewardCell/HistoricRewardCell'

import './Reward-styles.less'

export function Reward() {
	const { Title } = Typography
	const navigate = useNavigate()
	const { user } = useAuth()
	const [events, setEvents] = useState<TEvent[]>([])

	useEffect(() => {
		const loadPastEvents = async () => {
			if (user?.id) {
				// eslint-disable-next-line react-hooks/rules-of-hooks
				const events = await useFetchStudentPastEventData(user.id)
				setEvents(events)
			}
		}

		loadPastEvents()
	}, [user])

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
					<div>
						{events.map((event) => (
							<div>
								<HistoricEventCell event={event} />
								<div className="divider"></div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="right-div">
				<Title level={2}>Tes récompenses !</Title>
				<div className="historic-rewards">
					<div>
						<HistoricRewardCell />
						<div className="divider"></div>
					</div>
				</div>
			</div>
		</div>
	)
}
