import { UploadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Modal, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import React, { useState } from 'react'

import { useSupabase } from '@utils'

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
	const supabase = useSupabase()

	const { mutate } = useMutation({
		mutationFn: async (file: RcFile) => {
			return parseCsv(file, userId)
				.then(async (data) => {
					const { data: insertedData, error } = await supabase.from('contacts').insert(data)

					if (error) {
						setImportStatus(`Import failed: ${error.message}`)
						return false
					} else {
						setImportedData(insertedData)
						return true
					}
				})
				.catch(() => false)
		},
	})

	const beforeUpload = (file: RcFile, _fileList: RcFile[]) => {
		return mutate(file)
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
			<Upload accept=".csv" showUploadList={false} beforeUpload={beforeUpload}>
				<Button type="primary">
					<a href="/fichier/fichier.csv" download>
						Télécharger le fichier CSV de base
					</a>
				</Button>

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
