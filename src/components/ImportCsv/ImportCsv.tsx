import { UploadOutlined } from '@ant-design/icons'
import { Button, Modal, Upload } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/lib/upload'
import React, { useState } from 'react'

import { ImportItem } from './ImportCsv-types'
import { parseCsv } from './ImportCsv-utils'

interface CSVUploadModalProps {
	open: boolean
	onClose: () => void
	userId: string
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ open, onClose, userId }) => {
	const [importStatus, setImportStatus] = useState<string | null>(null)
	const [importedData, setImportedData] = useState<ImportItem[] | null>(null)

	const handleFileChange = (file: RcFile) => {
		setImportStatus('Importing...')
		setImportedData(null)

		parseCsv(file, userId)
			.then((data) => {
				setImportStatus('Import successful')
				setImportedData(data)
				console.log(data)
			})
			.catch((errors) => {
				setImportStatus(`Import failed: ${errors.message}`)
				console.error(errors)
			})

		return false
	}

	const handleUploadChange = (info: UploadChangeParam) => {
		if (info.file.status === 'done' || info.file.status === 'uploading') {
			handleFileChange(info.file.originFileObj as RcFile)
		}
	}

	return (
		<Modal
			open={open}
			title="Importer vos contacts depuis un fichier CSV"
			onCancel={onClose}
			footer={[
				<Button key="close" onClick={onClose}>
					Annuler
				</Button>,
			]}
		>
			<Upload
				accept=".csv"
				showUploadList={false}
				beforeUpload={handleFileChange}
				onChange={handleUploadChange}
			>
				<Button icon={<UploadOutlined />}>cliquer pour selectionner votre CSV</Button>
			</Upload>
			{importStatus && <p>{importStatus}</p>}
			{importedData && (
				<div>
					<h3>Imported Data:</h3>
					<pre>{JSON.stringify(importedData, null, 2)}</pre>
				</div>
			)}
		</Modal>
	)
}
