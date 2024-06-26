import { Session } from '@supabase/supabase-js'
import { RcFile } from 'antd/lib/upload'
import short from 'short-uuid'

const uuid = short()

interface IUploadBackgroundFileParams {
	file: RcFile | undefined
	session: Session
}

const APP_MODE = import.meta.env.MODE
const SUPABASE_URL =
	APP_MODE === 'staging'
		? import.meta.env.VITE_TEST_SUPABASE_URL
		: import.meta.env.VITE_SUPABASE_URL

export async function uploadBackgroundFile(params: IUploadBackgroundFileParams) {
	const { file, session } = params

	if (file instanceof File) {
		const fileExtension = getFileExtension(file.name)
		const fileId = uuid.new()

		const res = await fetch(
			`${SUPABASE_URL}/storage/v1/object/pictures/background_${fileId}.${fileExtension}`,
			{
				method: 'POST',
				body: file,
				headers: {
					'Content-Type': `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
					Authorization: `Bearer ${session?.access_token}`,
				},
			},
		)

		const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/pictures/background_${fileId}.${fileExtension}`

		if (res.ok) {
			return publicUrl
		} else {
			await Promise.reject("Le téléchargement de l'image a échoué.")
			return null
		}
	} else {
		return null
	}
}

export function getFileExtension(fileName: string) {
	const split = fileName.split('.')

	if (split.length <= 0) {
		return null
	}

	return split[split.length - 1]
}
