import { FileObject } from '@supabase/storage-js'

export interface IFileCardProps {
	file: FileObject
	path: string
}
