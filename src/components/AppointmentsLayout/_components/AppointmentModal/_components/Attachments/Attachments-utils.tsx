import { StorageError } from '@supabase/storage-js'
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js'
import { Space, Typography } from 'antd'

import { IDownloadAllAttachmentsParams } from './Attachments-types'

/**
 * Returns a custom error based on the original error message.
 */
export function getFormatedError(error: string) {
	const gap = 4

	if (error === 'The resource already exists') {
		return (
			<Space direction="horizontal" size={gap}>
				<Typography.Text strong>Ajout impossible.</Typography.Text>
				<Typography.Text>Ce fichier existe déjà.</Typography.Text>
			</Space>
		)
	} else if (error === 'The object name contains invalid characters') {
		return (
			<Space direction="horizontal" size={gap}>
				<Typography.Text strong>Ajout impossible.</Typography.Text>
				<Typography.Text>Le nom du fichier contient des caractères non supportés.</Typography.Text>
			</Space>
		)
	}

	return null
}

export async function downloadAllAttachments(params: IDownloadAllAttachmentsParams) {
	const { attachments, supabase, path } = params

	if (attachments.length === 0) {
		return false
	}

	const promises: Promise<
		| {
				data: Blob
				error: null
		  }
		| {
				data: null
				error: StorageError
		  }
	>[] = []

	attachments.forEach((file) => {
		promises.push(supabase.storage.from('attachments').download(`${path}/${file.name}`))
	})

	const response = await Promise.allSettled(promises)
	const downloadedFiles = response.map((result, index) => {
		if (result.status === 'fulfilled' && result.value.data) {
			return {
				name: attachments[index].name,
				blob: result.value.data,
			}
		}
	})

	// Create a new zip file
	const zipFileWriter = new BlobWriter('application/zip')
	const zipWriter = new ZipWriter(zipFileWriter, { bufferedWrite: true })

	// Add each file to the zip file
	downloadedFiles.forEach((downloadedFile) => {
		if (downloadedFile) {
			zipWriter.add(downloadedFile.name, new BlobReader(downloadedFile.blob))
		}
	})

	// Download the zip file
	const url = URL.createObjectURL(await zipWriter.close())
	const link = document.createElement('a')

	link.href = url
	link.setAttribute('download', 'pieces_jointes.zip')

	document.body.appendChild(link)

	link.click()
}
