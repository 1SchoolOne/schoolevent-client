import { Session, User } from '@supabase/supabase-js'

import { Database } from '@types'

export type TRole = Database['public']['Enums']['user_role']
export type TStudent = Database['public']['Tables']['students']['Row']

export interface IAuthContext {
	user: User | null
	session: Session | null
	studentData: TStudent | null
	role: TRole | null
	approved: boolean
}

export interface IAuthReducerState {
	session: Session | null
	user: User | null
	role: TRole | null
	studentData: TStudent | null
	approved: boolean | null
	loading: boolean
}

export type TAuthReducerActionType =
	| TSetSessionAction
	| TSetRoleAndApprovedAction
	| TResetStateAction
	| TSetStudentDataAction

type TSetSessionAction = {
	type: 'SET_SESSION'
	payload: {
		session: Session | null
	}
}

type TSetStudentDataAction = {
	type: 'SET_STUDENT_DATA'
	payload: {
		studentData: TStudent | null
	}
}

// `role` and `approved` are fetched together in one request,
// it makes more sense to update them together aswell.
type TSetRoleAndApprovedAction = {
	type: 'SET_ROLE_AND_APPROVED'
	payload: {
		role: TRole
		approved: boolean | null
	}
}

type TResetStateAction = {
	type: 'RESET'
	payload?: never
}
