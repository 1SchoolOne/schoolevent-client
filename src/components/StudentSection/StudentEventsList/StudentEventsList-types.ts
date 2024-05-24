import { TEvent } from '@types'

export interface IGroupedEvents {
	[year: number]: {
		[month: number]: Array<TEvent>
	}
}

export interface IRenderEventListParams {
	groupedEvents: IGroupedEvents
	activeYear: {
		value: string | string[]
		onChange: (value: string | string[]) => void
	}
	activeMonth: {
		value: string | string[]
		onChange: (value: string | string[]) => void
	}
}
export interface IGetYearCollapseParams extends IRenderEventListParams {
	year: number
}

export interface IGetMonthItemsParams extends Omit<IGetYearCollapseParams, 'activeYear'> {}
