import { useQuery } from '@tanstack/react-query'
import { Divider, Typography } from 'antd'

import { getNameFromEmail, log, useSupabase } from '@utils'

import { IAssigneeProps } from './Assignee-types'

export function Assignee(props: IAssigneeProps) {
	const { assigneeId, eventId } = props

	const supabase = useSupabase()

	const { data: assignee } = useQuery({
		queryKey: ['event', { id: eventId }, { assigneeId }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('users')
				.select('email')
				.eq('id', assigneeId!)
				.single()

			if (error) {
				log.error(error)
				throw error
			}

			return data
		},
		enabled: !!assigneeId,
	})

	return (
		<>
			<Divider>Référent</Divider>
			<div className="event-detail__body__assignee">
				{assignee ? (
					getNameFromEmail(assignee.email).name
				) : (
					<Typography.Text disabled>Aucun référent</Typography.Text>
				)}
			</div>
		</>
	)
}
