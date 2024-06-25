import { useMutation, useQueryClient } from '@tanstack/react-query'
import { message } from 'antd'

import { TFilters } from '@components'
import { useAuth } from '@contexts'
import { log, useSupabase } from '@utils'

import { TRole } from '../../../../contexts/Auth/Auth-types'
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

export function useApproveUsers({ successCallback }: { successCallback?: () => void }) {
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
			message.error("Une erreur est survenue lors de l'approbation des utilisateurs")
		},
	})
}

export function useDeactivateUsers({ successCallback }: { successCallback?: () => void }) {
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
			message.error('Une erreur est survenue lors de la désactivation des utilisateurs')
		},
	})
}

export function useDeleteUsers({ successCallback }: { successCallback?: () => void }) {
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
			message.error('Une erreur est survenue lors de la suppression des utilisateurs')
		},
	})
}

export function useUpdateUserRole({ successCallback }: { successCallback?: () => void }) {
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ id, role }: { id: number; role: TRole }) => {
			const { error } = await supabase.from('users').update({ role }).eq('id', id)

			if (error) {
				throw error
			}
		},
		onSuccess: async () => {
			successCallback?.()

			message.success("Le rôle de l'utilisateur a été mis à jour avec succès")
			await queryClient.resetQueries({ queryKey: ['admin'] })
		},
		onError: (error) => {
			log.error(error)
			message.error("Une erreur est survenue lors de la mise à jour du role de l'utilisateur")
		},
	})
}

/**
 * Custom function based on the original one from Table component utils.
 * It implements the search for the 'role' column as you can't use `ilike`
 * on enums.
 */
export function parseFiltersForSupabase<T>(filters: TFilters<keyof T> | undefined) {
	const queries: Array<string> = []

	if (filters === undefined) {
		return null
	}

	Object.keys(filters).forEach((dataIndex) => {
		const filterValues = filters[dataIndex as keyof T]
		console.log(`${dataIndex} = ${filterValues}`)

		if (filterValues === null) {
			return
		}

		if (dataIndex === 'role' && filterValues && filterValues.length >= 1) {
			queries.push(`role_text.in.(${(filterValues as Array<string>).join(',')})`)
		} else if (dataIndex === 'approved') {
			queries.push(`approved.eq.${filterValues}`)
		} else if (filterValues && filterValues.length > 1) {
			const innerQueries: Array<string> = []

			filterValues.forEach((value) => {
				innerQueries.push(`${dataIndex}.ilike.%${value}%`)
			})

			queries.push(`or(${innerQueries.join(',')})`)
		} else {
			queries.push(`${dataIndex}.ilike.%${filterValues![0]}%`)
		}
	})

	return queries.length > 0 ? queries.join(',') : null
}
