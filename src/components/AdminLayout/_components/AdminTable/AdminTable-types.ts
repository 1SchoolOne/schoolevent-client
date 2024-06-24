import { Database, Prettify } from '@types'

type TUser = Database['public']['Tables']['users']['Row']

interface AdminTableData extends TUser {
	userName: string
}

export type TAdminTableData = Prettify<AdminTableData>

interface IBtnStatusState {
	message: string
	disabled: boolean
}

export interface IAdminTableBtnReducerState {
	approveBtn: IBtnStatusState
	deactivateBtn: IBtnStatusState
	deleteBtn: IBtnStatusState
}

export type TAdminTableBtnReducerActionType =
	| ISetApproveBtnStatus
	| ISetDeactivateBtnStatus
	| ISetDeleteBtnStatus

interface ISetBtnStatus<T> {
	type: T
	payload: {
		message: string
		disabled: boolean
	}
}

interface ISetApproveBtnStatus extends ISetBtnStatus<'SET_APPROVE_BTN'> {}
interface ISetDeactivateBtnStatus extends ISetBtnStatus<'SET_DEACTIVATE_BTN'> {}
interface ISetDeleteBtnStatus extends ISetBtnStatus<'SET_DELETE_BTN'> {}
