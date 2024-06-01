import { Session } from '@supabase/supabase-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Form } from 'antd'
import { RcFile } from 'antd/lib/upload'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import short from 'short-uuid'

import { useAuth } from '@contexts'
import { TEvent } from '@types'
import { useAddressCompletion, useDebounce, useEvent, useGeoIP, useSupabase } from '@utils'

import { getFileExtension } from '../../EventForm-utils'

dayjs.extend(timezone)
dayjs.extend(utc)

const { useForm, useWatch } = Form
const uuid = short()

export function getFilePathFromUrl(url: string) {
	return url.split('/').at(-1) as string
}

export function useFormController(eventId: string | undefined) {
	const supabase = useSupabase()
	const { user, session } = useAuth()
	const [form] = useForm<typeof event>()

	const { data: event, isPending: isFetchingEvent } = useEvent(eventId)
	const { data: backgroundFile } = useBackgroundFile(event?.event_background, eventId)

	const formValues = useWatch((values) => values, form)

	const [fileList, setFileList] = useState<{ rcFile: Array<RcFile>; blob: Array<Blob> }>({
		rcFile: [],
		blob: [],
	})
	const [addressSearch, setAddressSearch] = useState(event?.event_address ?? '')
	const debouncedSearch = useDebounce(addressSearch, 500)

	const { data: userLocation } = useGeoIP()
	const { data: addressCompletion } = useAddressCompletion(debouncedSearch, userLocation)

	useEffect(() => {
		if (backgroundFile) {
			const rcFile = [
				blobToRcFile(backgroundFile, getFilePathFromUrl(event?.event_background ?? '')),
			]
			const blob = [backgroundFile]

			setFileList({ rcFile, blob })
		}
	}, [backgroundFile, event?.event_background])

	useEffect(() => {
		form.setFieldsValue({
			...event,
			event_date: dayjs(event?.event_date) as unknown as string,
			event_duration: event?.event_duration ? event.event_duration / 60 / 60 : 1.0,
		})
	}, [event, form])

	const removeBackground = async (url: string) => {
		const { error } = await supabase.storage.from('pictures').remove([getFilePathFromUrl(url)])

		if (error) {
			throw error
		} else {
			form.setFieldValue('event_background', null)
		}
	}

	const { mutate: createEvent, data, isPending: isCreatingEvent } = useCreateEvent(user!.id)
	const { mutate: updateEvent, isPending: isUpdatingEvent } = useUpdateEvent(
		event,
		removeBackground,
	)

	const onSubmit = () => {
		const values = form.getFieldsValue() as TEvent

		if (eventId) {
			updateEvent({ values, fileList: fileList.rcFile, session })
		} else {
			createEvent({ values, fileList: fileList.rcFile, session })
		}
	}

	return {
		form,
		event,
		formValues,
		backgroundFile,
		fileList,
		setFileList,
		onSubmit,
		setAddressSearch,
		addressCompletion,
		createdEventId: data?.id,
		isLoading: (eventId && isFetchingEvent) || isCreatingEvent || isUpdatingEvent,
	}
}

function useBackgroundFile(url: string | null | undefined, eventId: string | undefined) {
	const supabase = useSupabase()

	return useQuery({
		queryKey: ['event', { id: eventId }, { backgroundUrl: url }],
		queryFn: async () => {
			const filePath = getFilePathFromUrl(url!)

			const { data, error } = await supabase.storage.from('pictures').download(filePath)

			if (error) {
				throw error
			}

			return data
		},
		enabled: !!url,
	})
}

function useCreateEvent(userId: string) {
	const supabase = useSupabase()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			values,
			fileList,
			session,
		}: {
			values: TEvent
			fileList: RcFile[]
			session: Session | null
		}) => {
			if (!values) {
				throw new Error("Le formulaire n'est pas complet.")
			} else {
				const url = await uploadFile(fileList[0], session!)

				const { data, error } = await supabase
					.from('events')
					.insert({
						...values,
						event_creator_id: userId,
						event_background: url,
						event_date: dayjs(values.event_date).tz().toISOString(),
						event_duration: values.event_duration * 60 * 60,
					})
					.select('id')
					.single()

				if (error) {
					throw error
				}

				return data
			}
		},
		onSuccess: async ({ id }) => {
			await queryClient.invalidateQueries({ queryKey: ['events'] })
			navigate(`/events/view/${id}`)
		},
	})
}

function useUpdateEvent(
	event: TEvent | undefined,
	removeBackground: (url: string) => Promise<void>,
) {
	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	return useMutation({
		mutationFn: async ({
			values,
			fileList,
			session,
		}: {
			values: TEvent
			fileList: RcFile[]
			session: Session | null
		}) => {
			if (!event) {
				throw new Error("Impossible de mettre à jour l'événement car il n'est pas défini.")
			}

			let url: string | null = null

			// When there is a pending file in the Upload component and its name is different from the
			// current file, we should upload the new file. If the event already had a background we
			// delete it.
			if (fileList[0] && fileList[0].name !== getFilePathFromUrl(event.event_background ?? '')) {
				url = await uploadFile(fileList[0], session!)
				event.event_background && (await removeBackground(event.event_background))
			}
			// If the current file name is equal to the file name of the Upload component, the url should
			// not change.
			else if (
				fileList[0] &&
				getFilePathFromUrl(event.event_background ?? '') === getFilePathFromUrl(fileList[0].name)
			) {
				url = event.event_background
			} else if (!fileList[0] && event.event_background) {
				await removeBackground(event.event_background)
			}

			const { error } = await supabase
				.from('events')
				.update({
					...values,
					event_background: url,
					event_duration: values.event_duration * 60 * 60,
				})
				.eq('id', event.id)

			if (error) {
				throw error
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['event', { id: String(event?.id) }] })
			await queryClient.invalidateQueries({ queryKey: ['events'] })
			navigate(`/events/view/${event?.id}`)
		},
	})
}

async function uploadFile(file: RcFile | undefined, session: Session) {
	if (file instanceof File) {
		const fileExtension = getFileExtension(file.name)
		const fileId = uuid.new()

		const res = await fetch(
			`${
				import.meta.env.VITE_SUPABASE_URL
			}/storage/v1/object/pictures/background_${fileId}.${fileExtension}`,
			{
				method: 'POST',
				body: file,
				headers: {
					'Content-Type': `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
					Authorization: `Bearer ${session?.access_token}`,
				},
			},
		)

		const publicUrl = `${
			import.meta.env.VITE_SUPABASE_URL
		}/storage/v1/object/public/pictures/background_${fileId}.${fileExtension}`

		if (res.ok) {
			return publicUrl
		} else {
			await Promise.reject("Le téléchargement de l'image a échoué.")
			return null
		}
	} else {
		return null
	}
}

function blobToRcFile(file: Blob, name: string): RcFile {
	const uid = name.split('background_')[1].split('.')[0]
	const lastModifiedDate = new Date()
	const lastModified = Date.now()

	return { ...file, uid, name, lastModifiedDate, lastModified, webkitRelativePath: '' }
}
