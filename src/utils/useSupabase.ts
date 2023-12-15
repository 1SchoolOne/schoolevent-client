import { createClient } from '@supabase/supabase-js'

import { Database } from '@types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export function useSupabase() {
	if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase URL or Key')

	return supabase
}
