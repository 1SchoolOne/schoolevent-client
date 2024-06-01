import { useEffect, useState } from 'react'

import { renderEventList, useGroupedEvents } from './StudentEventsList-utils'
import { Skeleton } from './_components/Skeleton/Skeleton'

import './StudentEventsList-styles.less'

export function StudentEventList() {
	const [activeYear, setActiveYear] = useState<string | string[] | null>(null)
	const [activeMonth, setActiveMonth] = useState<string | string[] | null>(null)
	const { data: groupedEvents, isPending } = useGroupedEvents()

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

	return hasEvents
		? renderEventList({
				groupedEvents,
				activeYear: { value: activeYear ?? [], onChange: setActiveYear },
				activeMonth: { value: activeMonth ?? [], onChange: setActiveMonth },
		  })
		: 'Aucun événement disponible pour le moment.'
}
