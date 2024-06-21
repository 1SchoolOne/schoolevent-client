import { IAuthReducerState } from './Auth-types'

export const INIT_AUTH_STATE: IAuthReducerState = {
	session: null,
	user: null,
	studentData: null,
	role: null,
	approved: null,
	loading: true,
}
