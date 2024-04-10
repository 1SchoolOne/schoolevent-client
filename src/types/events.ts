import { Database } from './supabase'

export type TEvent = Database['public']['Tables']['events']['Row']
