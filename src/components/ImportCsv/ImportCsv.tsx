import { UploadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Modal, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useState } from 'react'

import { useSupabase } from '@utils'

import { ICSVUploadModalProps } from './ImportCsv-types'
import { parseCsv } from './ImportCsv-utils'

import './ImportCsv-style.less'

export function CSVUploadModal(props: ICSVUploadModalProps) {
	const { open, onClose, userId } = props

	const [importStatus, setImportStatus] = useState<string | null>(null)
	const supabase = useSupabase()

	const { mutate } = useMutation({
		mutationFn: async (file: RcFile) => {
			return parseCsv(file, userId)
				.then(async (data) => {
					const { error } = await supabase.from('contacts').insert(data)

					if (error) {
						setImportStatus(`Échec de l'importation :  ${error.message}`)
						return false
					} else {
						setImportStatus('Importation réussie !')
						return true
					}
				})
				.catch(() => {
					setImportStatus(
						"Échec de l'importation : Une erreur s'est produite lors de l'analyse du fichier.",
					)
					return false
				})
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
			<div style={{ textAlign: 'center' }}>
				<div className="modal-csv">
					<Button type="primary" className="button-csv">
						<a
							href="http://51.254.120.199:8000/storage/v1/object/public/csv/CSV_SchoolEvent.xlsx"
							download
						>
							Télécharger le fichier CSV de base
						</a>
					</Button>
					<Upload accept=".csv" showUploadList={false} beforeUpload={beforeUpload}>
						<Button icon={<UploadOutlined />} type="dashed" className="upload-button-csv">
							Cliquez pour sélectionner votre CSV
						</Button>
					</Upload>
				</div>
				{importStatus && (
					<Alert
						message={importStatus}
						type={importStatus.includes('failed') ? 'error' : 'success'}
						showIcon
						className="button-csv"
					/>
				)}
			</div>
		</Modal>
	)
}
