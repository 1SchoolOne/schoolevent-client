import {
	AuthError,
	AuthTokenResponse,
	SignInWithPasswordCredentials,
	SignOut,
	User,
} from '@supabase/supabase-js'

export interface IAuthContext {
	signIn: (credentials: SignInWithPasswordCredentials) => Promise<AuthTokenResponse>
	signOut: (options?: SignOut) => Promise<{
		error: AuthError | null
	}>
	user: User | null
}
