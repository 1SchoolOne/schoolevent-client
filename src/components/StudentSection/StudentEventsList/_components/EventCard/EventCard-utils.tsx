import dayjs from 'dayjs'

import { TEvent } from '@types'

export const getEventStartTime = (eventDate: string) => {
	const eventTime = dayjs(eventDate)
	return `${eventTime.hour()}h${eventTime.minute()}`
}

export const formatEventDuration = (duration: number) => {
	if (duration < 1) {
		return `${duration * 60} min`
	} else {
		const hours = Math.floor(duration)
		const minutes = (duration - hours) * 60
		if (minutes === 0) {
			return `${hours}h`
		} else {
			return `${hours}h${minutes}min`
		}
	}
}

export function getEventTypeLabel(eventType: TEvent['event_type']) {
	if (eventType === 'open_day') {
		return 'Portes ouvertes'
	} else if (eventType === 'conference') {
		return 'Conférence'
	} else {
		return 'Présentation'
	}
}
