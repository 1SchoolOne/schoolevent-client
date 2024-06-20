import { UseMutateFunction } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'

import { Database, TParticipant } from '@types'

type TParticipants =
	| Array<
			TParticipant & {
				users: Pick<Database['public']['Tables']['users']['Row'], 'id' | 'email'> | null
			}
	  >
	| undefined

export interface IParticipantsProps {
	eventId: string | undefined
	hasEditRights: boolean
}

export interface ISimpleListProps {
	participants: TParticipants
}

export interface ICheckListProps {
	eventId: string | undefined
	participants: TParticipants
	selectedParticipants: Array<string>
	setSelectedParticipants: Dispatch<SetStateAction<Array<string>>>
	approveParticipants: UseMutateFunction<
		Omit<
			{
				event_id: number
				id: number
				status: 'approved' | 'pending' | 'completed' | null
				student_points: number
				user_id: string
			},
			'id'
		>[],
		Error,
		Omit<
			{
				event_id: number
				id: number
				status: 'approved' | 'pending' | 'completed' | null
				student_points: number
				user_id: string
			},
			'id'
		>[],
		unknown
	>
	declineParticipants: (toDecline: Array<string>) => Promise<void>
}
