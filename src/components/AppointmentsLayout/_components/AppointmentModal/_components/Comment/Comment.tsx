import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar, Button, Input, List, Space, Tooltip, Typography } from 'antd'
import classNames from 'classnames'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ElementRef, useEffect, useRef, useState } from 'react'

import { Info } from '@components'
import { useAppointmentForm, useAuth } from '@contexts'
import { TComment, TComments } from '@types'
import { getNameFromEmail, useSupabase } from '@utils'

import { ICommentProps } from './Comment-types'

dayjs.extend(timezone)
dayjs.extend(utc)

/**
 * Returns a `<List.Item>` component with the comment content and actions
 */
export function Comment(props: ICommentProps) {
	const { comment } = props

	const [editMode, setEditMode] = useState(false)
	const [editValue, setEditValue] = useState(comment.content)
	const inputRef = useRef<ElementRef<'textarea'>>(null)
	const { user } = useAuth()
	const { appointmentId } = useAppointmentForm()
	const supabase = useSupabase()
	const queryClient = useQueryClient()

	const { initials, name } = getNameFromEmail(comment.users!.email)
	const displayName = user!.id === comment.author_id ? 'Vous' : name
	const timeFromNow = dayjs(comment.created_at).fromNow()

	const actions = [
		<Button
			key="edit"
			type="link"
			size="small"
			title="Modifier"
			onClick={() => {
				setEditMode((prevState) => !prevState)
			}}
		>
			{!editMode ? 'Modifier' : 'Annuler'}
		</Button>,
		<Button
			key="delete"
			type="link"
			size="small"
			title="Supprimer"
			danger
			onClick={() => {
				deleteComment(comment.id)
			}}
		>
			Supprimer
		</Button>,
	]

	const { mutate: editComment } = useMutation({
		mutationFn: async ({ id, content }: { id: number; content: string }) => {
			const { data, error } = await supabase
				.from('appointment_comments')
				.update({ content, updated_at: dayjs().tz().toISOString() })
				.eq('id', id)

			if (error) {
				console.error(error)
				throw error
			}

			return data
		},
		onMutate: ({ id, content }) => {
			queryClient.cancelQueries({
				queryKey: ['comments', { appointmentId: appointmentId ?? null }],
			})

			const previousComments = queryClient.getQueryData<TComments>([
				'comments',
				{ appointmentId: appointmentId ?? null },
			])

			queryClient.setQueryData(
				['comments', { appointmentId: appointmentId ?? null }],
				(oldComments: TComments) => {
					const oldComment = oldComments.find((c) => c.id === id)
					const newComment = { ...oldComment, content } as TComment
					const commentIndex = previousComments!.findIndex((c) => c.id === id)
					const newComments = [...previousComments!]

					newComments.splice(commentIndex, 1, newComment)

					return newComments
				},
			)

			return { previousComments }
		},
		onError: (_err, _newComment, context) => {
			queryClient.setQueryData(
				['comments', { appointmentId: appointmentId ?? null }],
				context?.previousComments,
			)
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['comments', { appointmentId: appointmentId ?? null }],
			})
		},
	})

	const { mutate: deleteComment } = useMutation({
		mutationFn: async (id: number) => {
			const { data, error } = await supabase.from('appointment_comments').delete().eq('id', id)

			if (error) {
				console.error(error)
				throw error
			}

			return data
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: ['comments', { appointmentId: appointmentId ?? null }],
			})
			queryClient.invalidateQueries({
				queryKey: ['comments-count', { appointmentId: appointmentId ?? null }],
			})
		},
	})

	useEffect(
		function focusInputOnEdit() {
			if (editMode) {
				inputRef.current?.focus()
			}
		},
		[editMode],
	)

	return (
		<List.Item
			key={comment.id}
			className="appointment-comments__list-item"
			actions={comment.author_id === user!.id ? actions : undefined}
		>
			<Space className="appointment-comments__list-item-container" direction="vertical" size={0}>
				<Space direction="horizontal" size={12}>
					<Avatar>{initials}</Avatar>
					<Typography.Text strong>{displayName}</Typography.Text>
					<Tooltip title={dayjs(comment.created_at).format('dddd DD MMMM YYYY à HH:mm')}>
						<Typography.Text type="secondary">{timeFromNow}</Typography.Text>
					</Tooltip>
					{comment.updated_at && <Typography.Text type="secondary">(modifié)</Typography.Text>}
				</Space>
				{editMode ? (
					<Space className="appointment-comments__edit-item-container" direction="vertical">
						<Input.TextArea
							className={classNames(
								'appointment-comments__list-item__content',
								'appointment-comments__list-item__content--edit',
							)}
							ref={inputRef}
							value={editValue}
							autoSize
							onChange={(e) => {
								setEditValue(e.target.value)
							}}
							onKeyDown={(e) => {
								if (e.key === 'Escape') {
									setEditMode(false)
									setEditValue(comment.content)
								} else if (e.shiftKey && e.key === 'Enter') {
									editComment({ id: comment.id, content: editValue })
									setEditMode(false)
								}
							}}
							onFocus={(e) => {
								// Set the cursor at the last character
								e.target.selectionStart = e.target.selectionEnd = comment.content.length
							}}
						/>
						<Info>
							<Typography.Text>
								Appuyez sur <Typography.Text keyboard>Shift + Entrer</Typography.Text> pour
								sauvegarder les modifications.
							</Typography.Text>
						</Info>
					</Space>
				) : (
					<Typography.Paragraph className="appointment-comments__list-item__content">
						{comment.content}
					</Typography.Paragraph>
				)}
			</Space>
		</List.Item>
	)
}
