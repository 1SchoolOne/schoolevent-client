import { FileObject } from '@supabase/storage-js'

import { useSupabase } from '@utils'

export interface IAttachmentsProps {
	appointmentId?: string
	readOnly: boolean
}

export interface IDownloadAllAttachmentsParams {
	attachments: FileObject[]
	supabase: ReturnType<typeof useSupabase>
	path: string
}
