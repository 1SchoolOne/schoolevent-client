import { Plus as NewIcon, ArrowClockwise as RefreshIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Result } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { renderEventList, useGroupedEvents } from './EventList-utils'
import { Skeleton } from './_components/Skeleton/Skeleton'

import './EventList-styles.less'

export function EventList() {
	const [activeYear, setActiveYear] = useState<string | string[] | null>(null)
	const [activeMonth, setActiveMonth] = useState<string | string[] | null>(null)
	const { data: groupedEvents, isPending } = useGroupedEvents()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const hasEvents = !!groupedEvents && Object.entries(groupedEvents).length > 0

	useEffect(() => {
		// Open the oldest section (year/month) on the first render
		if (hasEvents && !activeYear && !activeMonth) {
			const firstYear = Number(Object.keys(groupedEvents).sort()[0])
			const firstMonth = Number(Object.keys(groupedEvents[firstYear]).sort()[0])

			setActiveYear([String(firstYear)])
			setActiveMonth([String(firstYear) + String(firstMonth)])
		}
	}, [groupedEvents, hasEvents, activeMonth, activeYear])

	if (isPending) {
		return <Skeleton />
	}

	return (
		<>
			<div>
				<Button type="primary" icon={<NewIcon size={16} />} onClick={() => navigate('/events/new')}>
					Créer un événement
				</Button>
			</div>
			{hasEvents ? (
				renderEventList({
					groupedEvents,
					activeYear: { value: activeYear ?? [], onChange: setActiveYear },
					activeMonth: { value: activeMonth ?? [], onChange: setActiveMonth },
				})
			) : (
				<Result
					className="event-list__no-data"
					status="404"
					subTitle="Aucun événement disponible pour le moment."
					extra={
						<Button
							icon={<RefreshIcon size={16} />}
							onClick={() => queryClient.resetQueries({ queryKey: ['events'] })}
						>
							Actualiser
						</Button>
					}
				/>
			)}
		</>
	)
}
