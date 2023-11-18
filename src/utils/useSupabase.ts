import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL

const supabaseKey = process.env.VITE_SUPABASE_KEY

export function useSupabase() {
	if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase URL or Key')

	return createClient(supabaseUrl, supabaseKey)
}
