import { DownloadSimple as DownloadIcon, UploadSimple as UploadIcon } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { Alert, Button, Modal, Upload } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { saveAs } from 'file-saver'
import { useState } from 'react'

import { log, useSupabase } from '@utils'

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

	const downloadFile = async () => {
		const {
			data: { publicUrl },
		} = supabase.storage.from('csv').getPublicUrl('CSV_SchoolEvent.xlsx')
		const res = await fetch(publicUrl, { method: 'get' })

		if (!res.ok) {
			const error = new Error('Error while downloading template csv.')

			log.error(error)
			throw error
		}

		const blob = await res.blob()
		const file = new File([blob], 'CSV_SchoolEvent.xlsx')

		saveAs(file)
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
					<Button
						type="primary"
						className="button-csv"
						onClick={downloadFile}
						icon={<DownloadIcon size={16} />}
					>
						Télécharger le fichier exemple CSV
					</Button>
					<Upload accept=".csv" showUploadList={false} beforeUpload={beforeUpload}>
						<Button icon={<UploadIcon />} type="dashed" className="upload-button-csv">
							Sélectionner votre CSV
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
