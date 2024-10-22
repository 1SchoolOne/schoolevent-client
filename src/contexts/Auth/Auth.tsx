import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Spin } from 'antd'
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { PropsWithChildren } from '@types'
import { log, useSupabase } from '@utils'

import { INIT_AUTH_STATE } from './Auth-constants'
import { IAuthContext } from './Auth-types'
import { authReducer } from './Auth-utils'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [authState, setAuthState] = useReducer(authReducer, INIT_AUTH_STATE)

	const supabase = useSupabase()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	supabase.auth.getSession()

	useQuery({
		queryKey: ['studentData', { userId: authState?.user?.id }],
		queryFn: async () => {
			const { data, error } = await supabase
				.from('students')
				.select()
				.eq('user_id', authState!.user!.id)
				.single()

			if (error) {
				throw error
			}

			setAuthState({
				type: 'SET_STUDENT_DATA',
				payload: { studentData: data },
			})

			return data
		},
		enabled: !!authState.user && authState.role === 'student',
	})

	useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			const { data: userObject, error } = await supabase
				.from('users')
				.select('role,approved')
				.eq('user_id', authState.session!.user.id)
				.single()

			if (error) {
				throw error
			}

			setAuthState({
				type: 'SET_ROLE_AND_APPROVED',
				payload: { role: userObject.role, approved: userObject.approved },
			})

			return userObject
		},
		staleTime: 60 * 60_000, // 1 hour
		enabled: authState.session !== null && authState.role === null,
	})

	useEffect(function handleAuthStateChange() {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, newSession) => {
			const pathname = window.location.pathname.split('/').filter((i) => i)

			log.info(event, newSession)

			setAuthState({ type: 'SET_SESSION', payload: { session: newSession } })

			if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !newSession)) {
				setAuthState({ type: 'RESET' })
				queryClient.invalidateQueries()

				// Navigate to the login page only when the user is not already on it
				if (!pathname.includes('auth')) {
					navigate('/auth/login')
				}
			} else if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession)) {
				if (newSession) {
					if (pathname.includes('auth')) {
						navigate('/')
					}
				}
			}
		})

		return () => {
			subscription.unsubscribe()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const value: IAuthContext = useMemo(
		() => ({
			session: authState.session,
			user: authState.user,
			studentData: authState.studentData,
			role: authState.role,
			approved: !!authState.approved,
		}),
		[authState],
	)

	return (
		<AuthContext.Provider value={value}>
			{authState.loading ? (
				<div className="auth-loader">
					<Spin className="auth-loader__spin" size="large" />
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	return useContext(AuthContext)
}
