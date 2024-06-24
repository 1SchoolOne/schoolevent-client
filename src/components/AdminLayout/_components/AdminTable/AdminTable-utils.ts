import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import {
	IAdminTableBtnReducerState,
	TAdminTableBtnReducerActionType,
	TAdminTableData,
} from './AdminTable-types'

export function adminTableReducer(
	state: IAdminTableBtnReducerState,
	action: TAdminTableBtnReducerActionType,
): IAdminTableBtnReducerState {
	switch (action.type) {
		case 'SET_APPROVE_BTN':
			return {
				...state,
				approveBtn: action.payload,
			}
		case 'SET_DEACTIVATE_BTN':
			return {
				...state,
				deactivateBtn: action.payload,
			}
		case 'SET_DELETE_BTN':
			return {
				...state,
				deleteBtn: action.payload,
			}
	}
}

export function useApproveUsers(successCallback?: () => void) {
	const { user } = useAuth()
	const queryClient = useQueryClient()
	const supabase = useSupabase()

	return useMutation({
		mutationFn: async (selectedRows: Array<TAdminTableData>) => {
			const userIds = selectedRows.map((user) => user.id)

			const { error } = await supabase.rpc('approve_users', {
				user_ids: userIds,
				invoker_id: user!.id,
			})

			if (error) {
				throw error
			}

			return selectedRows.length
		},
		onSuccess: async (count) => {
			successCallback?.()
			if (count === 0) {
				message.info("Aucun utilisateur n'a été approuvé")
				return
			} else if (count === 1) {
				message.success(`${count} utilisateur a été approuvé`)
			} else {
				message.success(`${count} utilisateurs ont été approuvés`)
			}

			await queryClient.resetQueries({ queryKey: ['admin'] })
			await queryClient.resetQueries({ queryKey: ['pending-users-count'] })
		},
		onError: (error) => {
			log.error(error)
		},
	})
}

export function useDeactivateUsers(successCallback?: () => void) {
	const { user } = useAuth()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (selectedRows: Array<TAdminTableData>) => {
			const userIds = selectedRows.map((user) => user.id)

			const { error } = await supabase.rpc('deactivate_users', {
				user_ids: userIds,
				invoker_id: user!.id,
			})

			if (error) {
				throw error
			}

			return selectedRows.length
		},
		onSuccess: async (count) => {
			successCallback?.()
			if (count === 0) {
				message.info("Aucun utilisateur n'a été désactivé")
				return
			} else if (count === 1) {
				message.success(`${count} utilisateur a été désactivé`)
			} else {
				message.success(`${count} utilisateurs ont été désactivés`)
			}

			await queryClient.resetQueries({ queryKey: ['admin'] })
			await queryClient.resetQueries({ queryKey: ['pending-users-count'] })
		},
		onError: (error) => {
			log.error(error)
		},
	})
}

export function useDeleteUsers(successCallback?: () => void) {
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (selectedRows: Array<TAdminTableData>) => {
			const users = selectedRows.map((user) => user.id)

			const { error, count } = await supabase
				.from('users')
				.delete({ count: 'exact' })
				.in('id', users)

			if (error) {
				throw error
			}

			return count ?? 0
		},
		onSuccess: async (count) => {
			successCallback?.()
			if (count === 0) {
				message.info("Aucun utilisateur n'a été supprimé")
				return
			} else if (count === 1) {
				message.success(`${count} utilisateur a été supprimé`)
			} else {
				message.success(`${count} utilisateurs ont été supprimés`)
			}

			await queryClient.resetQueries({ queryKey: ['admin'] })
			await queryClient.resetQueries({ queryKey: ['pending-users-count'] })
		},
		onError: (error) => {
			log.error(error)
		},
	})
}
