import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { BasicLayout } from '@components'
import { useAuth } from '@contexts'

import { Form } from './_components/Form/Form'

import './EventForm-styles.less'

export function EventForm() {
	const { eventId } = useParams()
	const { role } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (role === 'student') {
			navigate('/events')
		}
	}, [role])

	if (role === null) {
		return null
	}

	return (
		<BasicLayout className="event-form-layout" contentClassName="event-form-layout__content">
			<Form eventId={eventId} />
		</BasicLayout>
	)
}
