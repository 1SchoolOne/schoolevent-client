import { Session, User } from '@supabase/supabase-js'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Spin } from 'antd'
import logger from 'loglevel'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PropsWithChildren } from '@types'
import { useSupabase } from '@utils'

import { IAuthContext, TRole } from './Auth-types'

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export function AuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const [role, setRole] = useState<TRole | null>(null)
	const [approved, setApproved] = useState<boolean | null>(null)
	const [loading, setLoading] = useState(true)
	const supabase = useSupabase()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const DEV_MODE = import.meta.env.DEV

	useEffect(() => {
		if (role && approved !== null) {
			setLoading(false)
		}
	}, [role, approved])

	useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			const { data: userObject, error } = await supabase
				.from('users')
				.select('role,approved')
				.eq('id', session!.user.id)
				.single()

			if (error) {
				throw error
			}

			if (userObject) {
				setRole(userObject.role)
				setApproved(userObject.approved)
			}

			return userObject
		},
		staleTime: 60 * 60_000, // 1 hour
		enabled: session !== null && role === null,
	})

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, newSession) => {
			const pathname = window.location.pathname.split('/').filter((i) => i)

			DEV_MODE && logger.info(event, newSession)

			setSession(newSession)
			setUser(newSession?.user ?? null)

			if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !newSession)) {
				setRole(null)
				queryClient.invalidateQueries()

				// Navigate to the login page only when the user is not already on it
				!pathname.includes('auth') && navigate('/auth/login')
			} else if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && newSession)) {
				if (newSession) {
					if (pathname.includes('auth')) {
						navigate('/')
					}
				}
			}
		})

		const getSession = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()

			if (error) {
				throw error
			}

			if (session) {
				const { data: userObject } = await supabase
					.from('users')
					.select('role')
					.eq('id', session.user.id)
					.single()

				if (userObject) {
					setRole(userObject.role)
				}
			}

			setSession(session)
			setUser(session?.user ?? null)
			setLoading(false)
		}

		getSession()

		return () => {
			subscription.unsubscribe()
		}
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const value: IAuthContext = useMemo(
		() => ({
			session,
			user,
			role,
			approved: !!approved,
		}),
		[session, user, role, approved],
	)

	return (
		<AuthContext.Provider value={value}>
			{loading ? (
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
