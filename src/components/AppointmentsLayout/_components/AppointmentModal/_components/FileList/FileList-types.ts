import { FileObject } from '@supabase/storage-js'

export interface IFileListProps {
	files: FileObject[]
	loading: boolean
}
