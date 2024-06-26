import { TFilters } from '@components'
import { TStudent } from '@types'

export function parseFilters(filters: TFilters<keyof TStudent> | undefined) {
	const queries: Array<string> = []

	if (filters === undefined) {
		return null
	}

	Object.keys(filters).forEach((dataIndex) => {
		const filterValues = filters[dataIndex as keyof TStudent]

		if (filterValues === null) {
			return
		}

		if (dataIndex === 'email') {
			return
		}

		if (dataIndex === 'courseName') {
			queries.push(`course_id.eq.${filterValues}`)
		} else if (dataIndex === 'points') {
			queries.push(`points.eq.${filterValues}`)
		} else if (filterValues && filterValues.length > 1) {
			const innerQueries: Array<string> = []

			filterValues.forEach((value) => {
				innerQueries.push(`${dataIndex}.ilike.%${value}%`)
			})

			queries.push(`or(${innerQueries.join(',')})`)
		} else {
			queries.push(`${dataIndex}.ilike.%${filterValues![0]}%`)
		}
	})

	return queries.length > 0 ? queries.join(',') : null
}
