import { useQuery } from '@tanstack/react-query'
import { Col, Collapse, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import { ItemType } from 'rc-collapse/lib/interface'

import { capitalize, log, useSupabase } from '@utils'

import {
	IGetMonthItemsParams,
	IGetYearCollapseParams,
	IGroupedEvents,
	IRenderEventListParams,
} from './StudentEventsList-types'
import { EventCard } from './_components/EventCard/EventCard'

dayjs.extend(localeData)

const monthLabels = dayjs.months()

export function useGroupedEvents() {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['events'],
		queryFn: async () => {
			const { data, error } = await supabase.from('events').select('*')

			if (error) {
				log.error('Error fetching events:', error)
				throw error
			}

			return data
		},
		// Parse the data to group events by year and by month
		select: (data) => {
			const groupedEvents: IGroupedEvents = {}

			data.forEach((e) => {
				const year = dayjs(e.event_date).year()
				const month = dayjs(e.event_date).month()
				const events = groupedEvents[year]?.[month] ?? []

				groupedEvents[year] = {
					...groupedEvents[year],
					[month]: [...events, e],
				}
			})

			return groupedEvents
		},
	})
}

export function renderEventList(params: IRenderEventListParams) {
	const { groupedEvents, activeYear, activeMonth } = params
	return Object.keys(groupedEvents)
		.sort()
		.map((year) => getYearCollapse({ groupedEvents, year: Number(year), activeYear, activeMonth }))
}

function getYearCollapse(params: IGetYearCollapseParams) {
	const { groupedEvents, year, activeYear, activeMonth } = params

	const months = getMonthItems({ groupedEvents, year: Number(year), activeMonth })

	return (
		<Collapse
			key={year}
			className="event-list__main-collapse"
			ghost
			accordion
			activeKey={activeYear.value}
			onChange={activeYear.onChange}
			items={[
				{
					key: year,
					label: (
						<Typography.Title className="event-list__collapse-label" level={4}>
							{year}
						</Typography.Title>
					),
					children: (
						<Collapse
							ghost
							accordion
							activeKey={activeMonth.value}
							onChange={activeMonth.onChange}
							items={months}
						/>
					),
				},
			]}
		/>
	)
}

function getMonthItems(params: IGetMonthItemsParams): Array<ItemType> {
	const { groupedEvents, year } = params

	return Object.keys(groupedEvents[year])
		.sort()
		.map((m) => {
			const month = Number(m)
			const label = capitalize(monthLabels[month])

			return {
				key: String(year) + String(month),
				label: (
					<Typography.Title className="event-list__collapse-label" level={5}>
						{label}
					</Typography.Title>
				),
				children: (
					<Row
						gutter={[
							{ xs: 8, sm: 16, md: 24, lg: 32 },
							{ xs: 8, sm: 16, md: 24, lg: 32 },
						]}
					>
						{groupedEvents[year][month].map((event, index) => (
							<Col key={'col' + year + month + index} span={8}>
								<EventCard event={event} />
							</Col>
						))}
					</Row>
				),
			}
		})
}
