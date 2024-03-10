import { Database } from '@types'

export type TFormMode = 'new' | 'edit' | 'view'

export interface IAppointmentFormContext {
	status?: Database['public']['Enums']['apt_status'] | null
	appointmentId?: string
	initialValues?: Partial<Database['public']['Tables']['appointments']['Row']>
	mode: TFormMode
	error: string | undefined
	isLoading: boolean
	hasLoaded: boolean
}

export interface IAppointmentFormProviderProps {
	status?: Database['public']['Enums']['apt_status'] | null
	schoolId?: string
	appointmentId?: string
	mode: TFormMode
}
