import {
	File,
	FileArchive,
	FileCsv,
	FileDoc,
	FileImage,
	FilePdf,
	FilePpt,
	FileSvg,
	FileText,
	FileVideo,
	FileXls,
} from '@phosphor-icons/react'

export function formatFileSize(bytes: number): string {
	const units = ['B', 'KB', 'MB', 'GB', 'TB']

	let i = 0

	while (bytes >= 1024 && i < units.length - 1) {
		bytes /= 1024
		i++
	}

	return bytes.toFixed(2) + ' ' + units[i]
}

export function getFileIcon(fileName: string, size = 64) {
	const iconColor = 'var(--ant-color-text-placeholder)'

	if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
		return <FileImage size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.svg')) {
		return <FileSvg size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.pdf')) {
		return <FilePdf size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.mp4')) {
		return <FileVideo size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx') || fileName.endsWith('.ods')) {
		return <FileXls size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.csv')) {
		return <FileCsv size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileName.endsWith('.odt')) {
		return <FileDoc size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx') || fileName.endsWith('.odp')) {
		return <FilePpt size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.rar') || fileName.endsWith('.zip')) {
		return <FileArchive size={size} weight="thin" color={iconColor} />
	} else if (fileName.endsWith('.txt')) {
		return <FileText size={size} weight="thin" color={iconColor} />
	}

	return <File size={size} weight="thin" color={iconColor} />
}
