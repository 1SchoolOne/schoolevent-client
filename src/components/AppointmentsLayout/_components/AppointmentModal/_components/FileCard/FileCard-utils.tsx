import { File, FileImage, FilePdf, FileVideo } from '@phosphor-icons/react'

export function formatFileSize(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']

	let i = 0

	while (bytes >= 1024 && i < units.length - 1) {
		bytes /= 1024
		i++
	}

	return bytes.toFixed(2) + ' ' + units[i]
}

export function getFileIcon(mimeType: string, size = 64) {
	if (mimeType.startsWith('image')) {
		return <FileImage size={size} weight="thin" />
	} else if (mimeType === 'application/pdf') {
		return <FilePdf size={size} weight="thin" />
	} else if (mimeType === 'video/mp4') {
		return <FileVideo size={size} weight="thin" />
	}

	return <File size={size} />
}
