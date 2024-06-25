import { Database } from '@types'

export type ImportItem = Omit<Database['public']['Tables']['contacts']['Row'], 'id'>

export interface ICSVUploadModalProps {
	open: boolean
	onClose: () => void
	userId: string
}
