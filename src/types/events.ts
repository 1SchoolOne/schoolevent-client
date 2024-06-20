import { Database } from './supabase'

export type TEvent = Database['public']['Tables']['events']['Row']
export type TParticipant = Database['public']['Tables']['events_participants']['Row']
