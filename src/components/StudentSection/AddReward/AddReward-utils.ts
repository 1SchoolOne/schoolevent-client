import { Session } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App, Form } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { useEffect, useState } from 'react'

import { useAuth } from '@contexts'
import { TReward } from '@types'
import { uploadBackgroundFile, useSupabase } from '@utils'

const { useForm, useWatch } = Form

export function useController() {
	const { session } = useAuth()
	const [formInstance] = useForm()
	const formValues = useWatch((values) => values, formInstance)
	const [backgroundUrl, setBackgroundUrl] = useState<string | ArrayBuffer | undefined>(undefined)
	const [fileList, setFileList] = useState<{ rcFile: Array<RcFile>; blob: Array<Blob> }>({
		rcFile: [],
		blob: [],
	})
	const { mutate: createReward } = useCreateReward()

	useEffect(() => {
		if (fileList.blob[0]) {
			const reader = new FileReader()

			reader.onload = (ev) => {
				setBackgroundUrl(ev.target?.result ?? undefined)
			}

			reader.readAsDataURL(fileList.blob[0])
		} else {
			setBackgroundUrl(undefined)
		}
	}, [fileList.blob])

	const onSubmit = (values: Omit<TReward, 'id'>) => {
		createReward({ values, fileList: fileList.rcFile, session: session! })
	}

	return {
		formInstance,
		formValues,
		backgroundUrl,
		fileList,
		setFileList,
		onSubmit,
	}
}

function useCreateReward() {
	const supabase = useSupabase()
	const queryClient = useQueryClient()
	const { message } = App.useApp()

	return useMutation({
		mutationFn: async ({
			values,
			fileList,
			session,
		}: {
			values: Omit<TReward, 'id'>
			fileList: Array<RcFile>
			session: Session
		}) => {
			const url = await uploadBackgroundFile({ file: fileList[0], session })

			const { data, error } = await supabase
				.from('rewards')
				.insert({ ...values, reward_background: url })
				.select()
				.single()

			if (error) {
				throw error
			}

			return data
		},
		onSuccess: async ({ reward_name }) => {
			await queryClient.resetQueries({ queryKey: ['rewards'] }).then(() => {
				message.success(`La récompense "${reward_name}" a été créée avec succès`)
			})
		},
		onError: async () => {
			await message.error("Une erreur est survenue lors de l'ajout de la récompense")
		},
	})
}
