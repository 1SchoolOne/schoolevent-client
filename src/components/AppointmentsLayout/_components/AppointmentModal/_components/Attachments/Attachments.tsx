import {
	Plus as AddIcon,
	DownloadSimple as DownloadIcon,
	Paperclip as PaperclipIcon,
} from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Space, Upload } from 'antd'

import { Divider } from '@components'
import { useAppointmentForm } from '@contexts'
import { log, useSupabase } from '@utils'

import { FileList } from '../FileList/FileList'
import { ACCEPTED_FILE_TYPES } from './Attachments-constants'
import { downloadAllAttachments, getFormatedError } from './Attachments-utils'

export function Attachments() {
	const { appointmentId, mode } = useAppointmentForm()
	const supabase = useSupabase()
	const { message } = App.useApp()
	const queryClient = useQueryClient()

	const { data: attachments, isLoading } = useQuery({
		queryKey: ['attachments', { appointmentId: appointmentId ?? null }],
		queryFn: async () => {
			const { data, error } = await supabase.storage
				.from('attachments')
				.list(`appointment_${appointmentId}`)

			if (error) {
				log.error(error)
				throw error
			}

			return data
		},
		placeholderData: [],
	})

	const { mutate: uploadFile } = useMutation({
		mutationFn: async (file: File) => {
			const { error } = await supabase.storage
				.from('attachments')
				.upload(`appointment_${appointmentId}/${file.name}`, file)

			if (error) {
				log.error(error)

				const defaultError = `${error.name ? error.name + ': ' : ''}${error.message}`
				const formattedError = getFormatedError(error.message)
				message.error(formattedError ?? defaultError, 7.5)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ['attachments', { appointmentId }],
			})
		},
	})

	const shouldDisplayMoreActions = mode !== 'new' && attachments && attachments.length > 1

	return (
		<Space className="appointment-attachments" direction="vertical" style={{ width: '100%' }}>
			<Divider
				icon={<PaperclipIcon size={16} />}
				title={`Pièces jointes (${attachments?.length ?? 0})`}
				mainAction={
					mode === 'view'
						? undefined
						: {
								icon: <AddIcon size={16} weight="bold" />,
								tooltip: {
									title: 'Ajouter une pièce jointe',
								},
								render: (button) => (
									<Upload
										accept={ACCEPTED_FILE_TYPES}
										beforeUpload={() => false}
										showUploadList={false}
										onChange={async ({ file }) => {
											if (file instanceof File) {
												uploadFile(file)
											}
										}}
									>
										{button}
									</Upload>
								),
						  }
				}
				moreActions={
					shouldDisplayMoreActions
						? {
								trigger: ['click'],
								menu: {
									items: [
										{
											key: 'download-all',
											label: 'Tout télécharger',
											icon: <DownloadIcon size={16} />,
											onClick: () => {
												attachments &&
													downloadAllAttachments({
														attachments,
														supabase,
														path: `appointment_${appointmentId}`,
													})
											},
										},
									],
								},
						  }
						: undefined
				}
			/>
			<FileList files={attachments ?? []} loading={isLoading} />
		</Space>
	)
}
