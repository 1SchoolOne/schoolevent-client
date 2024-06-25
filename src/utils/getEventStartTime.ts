import dayjs from 'dayjs'

export const getEventStartTime = (eventDate: string) => {
	const eventTime = dayjs(eventDate)
	const hours = eventTime.hour()
	const minutes = eventTime.minute()

	let formattedTime = `${hours}h`
	if(minutes !== 0) {
		formattedTime += minutes < 10 ? `0${minutes}` : minutes
	}
	return formattedTime
}