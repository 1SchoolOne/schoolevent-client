import { createClient } from '@supabase/supabase-js'

import { Database } from '@types'

const APP_MODE = import.meta.env.MODE

const supabaseUrl =
	APP_MODE === 'staging'
		? import.meta.env.VITE_TEST_SUPABASE_URL
		: import.meta.env.VITE_SUPABASE_URL
const supabaseKey =
	APP_MODE === 'staging'
		? import.meta.env.VITE_TEST_SUPABASE_KEY
		: import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export function useSupabase() {
	if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase URL or Key')

	return supabase
}
