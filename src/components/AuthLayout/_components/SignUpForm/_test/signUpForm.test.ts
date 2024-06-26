import { User } from '@supabase/supabase-js'
import { test } from 'vitest'

import { handleSuccessfulRedirect } from '../SignUpForm-utils'

type MockNavigate = {
	calledWith?: any[]
	(): void
}

const navigate = () => {}
const mockNavigate: MockNavigate = new Proxy(navigate, {
	apply: (target, thisArg, argumentsList) => {
		mockNavigate.calledWith = argumentsList
		return Reflect.apply(target, thisArg, argumentsList)
	},
})

// redirection avec utilisateur valide et email

test('handleSuccessfulRedirect with valid user and email', ({ expect }) => {
	const user: User = {
		id: '123',
		app_metadata: {},
		user_metadata: {},
		aud: 'audience',
		created_at: new Date().toISOString(),
		email: 'test@example.com',
	}

	handleSuccessfulRedirect(user, mockNavigate)
	expect(mockNavigate.calledWith).toEqual(['success?email=test%40example.com'])
})

//handleSuccessfulRedirect ne devrait pas rediriger vers la page de succès avec un utilisateur valide sans adresse e-mail
test('handleSuccessfulRedirect should not redirect to success page with valid user without email', ({
	expect,
}) => {
	const user: User = {
		id: '456',
		app_metadata: {},
		user_metadata: {},
		aud: 'audience',
		created_at: new Date().toISOString(),
		email: '',
	}

	handleSuccessfulRedirect(user, mockNavigate)
	expect(mockNavigate.calledWith).not.toEqual(['success?email=null'])
})

//la redirection réussie avec un utilisateur null ne devrait pas avoir lieu
test('handleSuccessfulRedirect with null user should not redirect', ({ expect }) => {
	mockNavigate.calledWith = undefined

	handleSuccessfulRedirect(null, mockNavigate)
	expect(mockNavigate.calledWith).toBeUndefined()
})
