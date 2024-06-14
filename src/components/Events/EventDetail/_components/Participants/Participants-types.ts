import { UseMutateFunction } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'

import { Database } from '@types'

type TParticipants =
	| Array<
			Database['public']['Tables']['events_participants']['Row'] & {
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
		{ id: number; event_id: number; user_id: string; approved: boolean }[],
		Error,
		{ id: number; event_id: number; user_id: string; approved: boolean }[],
		unknown
	>
	declineParticipants: (toDecline: Array<string>) => Promise<void>
}
