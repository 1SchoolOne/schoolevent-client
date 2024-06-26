import { SupabaseClient } from '@supabase/supabase-js'
import { test, vi } from 'vitest'

import { onFinish } from '../LoginForm-utils'
import { parseLoginError } from '../LoginForm-utils'

test('onFinish should not call setError if email or password is missing', async ({ expect }) => {
	const setError = vi.fn()
	const supabase = {} as SupabaseClient

	await onFinish({ email: '', password: 'password' }, setError, supabase)
	await onFinish({ email: 'email@example.com', password: '' }, setError, supabase)
	await onFinish({ email: '', password: '' }, setError, supabase)

	expect(setError).not.toHaveBeenCalled()
})

test('onFinish should call setError with parsed error message if there is an error', async ({
	expect,
}) => {
	const setError = vi.fn()
	const supabase = {
		auth: {
			signInWithPassword: vi
				.fn()
				.mockResolvedValue({ error: { message: 'Invalid login credentials' } }),
		},
	} as unknown as SupabaseClient

	await onFinish({ email: 'email@example.com', password: 'password' }, setError, supabase)

	expect(setError).toHaveBeenCalledWith('Email ou mot de passe invalide.')
})

test('onFinish should not call setError if there is no error', async ({ expect }) => {
	const setError = vi.fn()
	const supabase = {
		auth: {
			signInWithPassword: vi.fn().mockResolvedValue({}),
		},
	} as unknown as SupabaseClient

	await onFinish({ email: 'email@example.com', password: 'password' }, setError, supabase)

	expect(setError).not.toHaveBeenCalled()
})

test('parseLoginError should return the correct error message', ({ expect }) => {
	const message = 'Invalid login credentials'
	const result = parseLoginError(message)
	expect(result).toBe('Email ou mot de passe invalide.')

	const invalidMessage = 'Some other message'
	const invalidResult = parseLoginError(invalidMessage)
	expect(invalidResult).toBeUndefined()
})
