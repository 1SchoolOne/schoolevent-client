import { Database } from '@types'

export type ImportItem = Omit<Database['public']['Tables']['contacts']['Row'], 'id'>
