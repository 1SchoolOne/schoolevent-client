import { IAuthReducerState, TAuthReducerActionType } from './Auth-types'

export function authReducer(
	state: IAuthReducerState,
	action: TAuthReducerActionType,
): IAuthReducerState {
	switch (action.type) {
		case 'SET_SESSION':
			return {
				...state,
				session: action.payload.session,
				user: action.payload.session?.user ?? null,
			}
		case 'SET_ROLE_AND_APPROVED':
			return {
				...state,
				role: action.payload.role,
				approved: action.payload.approved,
				// synchronously set the loading when `role` and `approved` are updated
				loading: !(action.payload.role !== null && action.payload.approved !== null),
			}
		case 'RESET':
			return {
				session: null,
				user: null,
				role: null,
				approved: null,
				loading: false,
			}
	}
}
