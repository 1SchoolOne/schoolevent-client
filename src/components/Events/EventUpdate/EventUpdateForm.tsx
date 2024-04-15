import { BasicLayout } from '@components'

import { UpdateForm } from './UpdateForm'

import '../EventForm/EventForm-styles.less'

export function EventUpdateForm() {
	return (
		<BasicLayout className="event-form-layout" contentClassName="event-form-layout__content">
			<UpdateForm />
		</BasicLayout>
	)
}
