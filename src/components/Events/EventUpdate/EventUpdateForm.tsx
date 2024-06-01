import { useParams } from 'react-router-dom'

import { BasicLayout } from '@components'

import { Form } from '../EventForm/_components/Form/Form'

import '../EventForm/EventForm-styles.less'

export function EventUpdateForm() {
	const { eventId } = useParams()

	return (
		<BasicLayout className="event-form-layout" contentClassName="event-form-layout__content">
			<Form eventId={eventId} />
		</BasicLayout>
	)
}
