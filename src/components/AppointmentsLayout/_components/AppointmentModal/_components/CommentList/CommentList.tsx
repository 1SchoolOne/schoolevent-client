import {
	ChatDots as MessageIcon,
	PaperPlaneTilt,
	SortAscending as SortAscIcon,
	SortDescending as SortDscIcon,
} from '@phosphor-icons/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Input, List, Select, Space, Typography } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useLayoutEffect, useState } from 'react'

import { Divider } from '@components'
import { useAppointmentForm, useAuth } from '@contexts'
import { ICommentSortStorage, TComments } from '@types'
import { useLocalStorage, useSupabase } from '@utils'

import { Comment } from '../Comment/Comment'

import './CommentList-styles.less'

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(utc)

export function CommentList() {
	const [sort, setSort] = useState<'asc' | 'dsc'>('dsc')
	const [inputValue, setInputValue] = useState('')
	const { appointmentId } = useAppointmentForm()
	const supabase = useSupabase()
	const localStorage = useLocalStorage()
	const { user } = useAuth()
	const queryClient = useQueryClient()

	useLayoutEffect(() => {
		if (localStorage.has('comments.sort')) {
			setSort(localStorage.get('comments.sort') as ICommentSortStorage)
		} else {
			localStorage.set({ key: 'comments.sort', data: 'dsc' })
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSortSelect = (value: 'asc' | 'dsc') => {
		setSort(value)
		localStorage.set({ key: 'comments.sort', data: value })
	}

	const { mutate: newComment } = useMutation({
		mutationFn: async (content: string) => {
			const { data, error } = await supabase.from('appointment_comments').insert({
				appointment_id: Number(appointmentId),
				author_id: user!.id,
				content,
				created_at: dayjs().tz().toISOString(),
			})

			if (error) {
				console.error(error)
				throw error
			}

			return data
		},
		onMutate: (content) => {
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
					const newComments = [...oldComments]

					let id = 0

					if (newComments.length > 0) {
						id = newComments.reduce((max, current) => {
							return current.id > max.id ? current : max
						}, newComments[0]).id
					}

					newComments.push({
						id,
						author_id: user!.id,
						appointment_id: Number(appointmentId),
						content,
						created_at: dayjs().tz().toISOString(),
						updated_at: null,
					})
				},
			)

			return { previousComments }
		},
		onError: (_err, _newComments, context) => {
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

	const { data: comments } = useQuery({
		queryKey: ['comments', { appointmentId: appointmentId ?? null }],
		queryFn: async () => {
			if (!appointmentId) {
				throw new Error('appointmentId is required')
			}

			const { data, error } = await supabase
				.from('appointment_comments')
				.select('*,users(*)')
				.eq('appointment_id', appointmentId)

			if (error) {
				console.error(error)
				throw error
			}

			return data
		},
		enabled: !!appointmentId,
		placeholderData: [],
	})

	const sortedComments =
		comments?.sort((a, b) => {
			if (sort === 'asc') {
				return dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1
			} else {
				return dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1
			}
		}) ?? []

	return (
		<Space className="appointment-comments" direction="vertical">
			<Divider icon={<MessageIcon size={16} />} title={`Commentaires (${comments?.length ?? 0})`} />
			<Space className="appointment-comments__new-comment" direction="vertical">
				<Input.TextArea
					value={inputValue}
					placeholder="Ajouter un commentaire..."
					autoSize={{ minRows: 1, maxRows: 6 }}
					onChange={(e) => {
						setInputValue(e.target.value)
					}}
				/>
				<Button
					type="primary"
					icon={<PaperPlaneTilt size={16} />}
					onClick={() => {
						newComment(inputValue)
						setInputValue('')
					}}
				>
					Commenter
				</Button>
			</Space>
			{comments && comments.length > 0 && (
				<Space className="appointment-comments__sorter" direction="horizontal">
					<Typography.Text>Trier :</Typography.Text>
					<Select
						className="appointment-comments__sorter__select"
						popupClassName="appointment-comments__sorter__dropdown"
						value={sort}
						options={[
							{
								value: 'asc',
								label: (
									<Space direction="horizontal" align="center">
										<SortAscIcon className="appointment-comments__sorter__icon" size={16} />
										<Typography.Text>Du plus vieux</Typography.Text>
									</Space>
								),
							},
							{
								value: 'dsc',
								label: (
									<Space direction="horizontal" align="center">
										<SortDscIcon className="appointment-comments__sorter__icon" size={16} />
										<Typography.Text>Du plus récent</Typography.Text>
									</Space>
								),
							},
						]}
						onSelect={handleSortSelect}
					/>
				</Space>
			)}
			<List
				className="appointment-comments__list"
				itemLayout="vertical"
				dataSource={sortedComments}
				renderItem={(comment) => <Comment comment={comment} />}
				locale={{
					emptyText: 'Aucun commentaire.',
				}}
			/>
		</Space>
	)
}
