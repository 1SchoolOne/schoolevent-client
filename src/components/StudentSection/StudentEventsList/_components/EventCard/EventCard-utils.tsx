import dayjs from 'dayjs'

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

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