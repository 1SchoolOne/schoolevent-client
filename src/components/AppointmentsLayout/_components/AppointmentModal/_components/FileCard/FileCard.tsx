import { Trash as DeleteIcon, DownloadSimple as DownloadIcon } from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, Spin, Typography } from 'antd'
import { saveAs } from 'file-saver'

import { IconButton } from '@components'
import { useAppointmentForm } from '@contexts'
import { log, useSupabase } from '@utils'

import { IFileCardProps } from './FileCard-types'
import { formatFileSize, getFileIcon } from './FileCard-utils'

import './FileCard-styles.less'

export function FileCard(props: IFileCardProps) {
	const { file, path } = props

	const { appointmentId } = useAppointmentForm()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	const fileType = file.metadata['mimetype'] as string
	const fileSize = formatFileSize(file.metadata['size'])
	const displayCover = fileType.startsWith('image/')

	const downloadFile = async () => {
		const { data, error } = await supabase.storage.from('attachments').download(path)

		if (error) {
			log.error(error)
			throw error
		}

		saveAs(data, file.name)
	}

	const { mutate: deleteFile, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.storage.from('attachments').remove([path])

			if (error) {
				log.error(error)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.refetchQueries({ queryKey: ['attachments', { appointmentId }] })
		},
	})

	const actions: React.ReactNode[] = [
		<IconButton
			key="delete-btn"
			type="text"
			icon={<DeleteIcon size={16} />}
			title="Supprimer"
			onClick={() => {
				deleteFile()
			}}
			loading={isDeleting}
			danger
		/>,
		<IconButton
			key="download-btn"
			type="text"
			icon={<DownloadIcon size={16} />}
			title="Télécharger"
			onClick={downloadFile}
		/>,
	]

	const { data: url, isLoading } = useQuery({
		queryKey: ['attachment', { name: file.name }],
		queryFn: async () => {
			const { data, error } = await supabase.storage
				.from('attachments')
				// TODO fix supabase signed url transform issue
				.createSignedUrl(path, 60 * 10, {
					// transform: { width: 300, height: 160, resize: 'cover' },
				})

			if (error) {
				log.error(error)
				throw error
			}

			return data.signedUrl
		},
		enabled: displayCover,
	})

	const getCover = () => {
		if (!displayCover) {
			return <div className="file-icon">{getFileIcon(file.name)}</div>
		}

		return isLoading ? (
			<Spin />
		) : (
			<img className="file-preview" alt={`${file.name} preview`} src={url} />
		)
	}

	return (
		<Card
			className="file-card"
			style={{ width: '150px' }}
			cover={getCover()}
			size="small"
			actions={actions}
		>
			<Card.Meta
				title={
					<Typography.Text title={file.name} ellipsis>
						{file.name}
					</Typography.Text>
				}
				description={fileSize}
			/>
		</Card>
	)
}
