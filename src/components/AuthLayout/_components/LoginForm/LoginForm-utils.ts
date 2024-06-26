import { SupabaseClient } from '@supabase/supabase-js'

import { ILoginFormFields } from '../types'

export function parseLoginError(message: string) {
	if (message === 'Invalid login credentials') {
		return 'Email ou mot de passe invalide.'
	}
}
export async function onFinish(
	values: ILoginFormFields,
	setError: (error: string | null) => void,
	supabase: SupabaseClient,
) {
	const { email, password } = values

	if (!email || !password) return

	const { error } = await supabase.auth.signInWithPassword({ email, password })

	if (error) {
		console.error(error)
		const parsedMessage = parseLoginError(error.message)
		parsedMessage && setError(parsedMessage)
	}
}
