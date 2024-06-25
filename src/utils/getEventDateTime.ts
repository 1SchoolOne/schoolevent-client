import dayjs from 'dayjs'

export const getEventDateTime = (eventDate: string | undefined) => {
	const date = dayjs(eventDate)
	const day = date.date()
	const formattedDate = date.format(`dddd ${day} MMMM`)
	return formattedDate
}