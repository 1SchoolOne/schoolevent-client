import { IAuthReducerState } from './Auth-types'

export const INIT_AUTH_STATE: IAuthReducerState = {
	session: null,
	user: null,
	role: null,
	approved: null,
	loading: true,
}
