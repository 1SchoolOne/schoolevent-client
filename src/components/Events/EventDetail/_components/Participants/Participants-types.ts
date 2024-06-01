import { UseMutateFunction } from '@tanstack/react-query'
import { Dispatch, SetStateAction } from 'react'

type TParticipants =
	| {
			approved: boolean
			event_id: number
			id: number
			user_id: string
			users: {
				id: string
				email: string
			} | null
	  }[]
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
