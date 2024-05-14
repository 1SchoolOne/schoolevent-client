import { UploadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import {
	Form as AntdForm,
	Button,
	Col,
	ConfigProvider,
	DatePicker,
	Divider,
	Input,
	InputNumber,
	Row,
	Typography,
	Upload,
	theme as themeAlg,
} from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import short from 'short-uuid'

import { AutoCompleteField, IconButton, SelectField } from '@components'
import { useAuth, useTheme } from '@contexts'
import { fetchAddressCompletion, fetchGeoIP, log, useDebounce, useSupabase } from '@utils'

import { TEventTypeValue } from '../EventForm/EventForm-types'
import { getFileExtension } from '../EventForm/EventForm-utils'
import { eventTypeLabelRecord } from '../EventForm/_components/Form/Form-types'
import { getFilePathFromUrl } from '../EventForm/_components/Form/Form-utils'
import { IEventFormFields } from '../type'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('fr')

export function UpdateForm() {
	const { eventId } = useParams<{ eventId: string }>()

	const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null)
	const [eventTitle, setEventTitle] = useState("Titre de l'événement")
	const [addressSearch, setAddressSearch] = useState('')
	const [eventData, setEventData] = useState<IEventFormFields | null>(null)
	const debouncedSearch = useDebounce(addressSearch, 500)
	const [form] = AntdForm.useForm()
	const { user, session } = useAuth()
	const { theme } = useTheme()
	const supabase = useSupabase()
	const navigate = useNavigate()
	const translator = short()

	const { data: userLocation } = useQuery({ queryKey: ['user-geoip'], queryFn: fetchGeoIP })

	const formatDate = 'DD/MM/YYYY à HH:mm'

	useEffect(() => {
		const fetchEvent = async () => {
			const { data, error } = await supabase.from('events').select('*').eq('id', eventId!).single()

			if (error) {
				log.error('Error fetching event:', error)
			} else if (data) {
				setEventData(data as IEventFormFields | null)
			}
		}
		log.log('eventData', eventData)

		fetchEvent()
	}, [supabase, eventId])

	const { data: addressCompletion } = useQuery({
		queryKey: ['addresse-completion', { search: debouncedSearch }],
		queryFn: async () => await fetchAddressCompletion(debouncedSearch, userLocation),
		enabled: !!debouncedSearch && !!userLocation,
		initialData: [],
	})

	const updateEvent = async (value: IEventFormFields | null) => {
		await supabase.from('events').update({
			...value,
			event_creator_id: user!.id,
			event_background: backgroundUrl,
			event_date: eventData?.event_date
				? dayjs(eventData?.event_date)
						.tz()
						.toISOString()
				: '',
			event_duration: value?.event_duration ?? 0 * 60 * 60,
			event_type: value?.event_type === 'portes_ouvertes' ? 'open_day' : value?.event_type,
		})
	}

	const removeBackground = useCallback(async () => {
		if (!backgroundUrl) {
			return true
		}

		const { error } = await supabase.storage
			.from('pictures')
			.remove([getFilePathFromUrl(backgroundUrl)])

		if (error === null) {
			setBackgroundUrl(null)
		}

		return !!error
	}, [supabase, backgroundUrl])

	// if (!eventData) {
	// 	return <div>Chargement...</div>
	// }

	return (
		<AntdForm
			className="event-form"
			form={form}
			name="event"
			size="large"
			layout="vertical"
			autoComplete="off"
			initialValues={{
				event_duration: eventData?.event_duration ? eventData?.event_duration / 60 / 60 : 1.0,
				event_title: eventData?.event_title || '',
				event_address: eventData?.event_address || '',
				event_school_name: eventData?.event_school_name || '',
				event_background: eventData?.event_background || '',
				event_date: eventData?.event_date
					? dayjs(eventData?.event_date)
							.tz()
							.toISOString()
					: '',
				event_description: eventData?.event_description || '',
				event_type:
					eventData?.event_type === ('open_day' as TEventTypeValue)
						? 'Porte ouverte'
						: eventData?.event_type === 'presentation'
						? 'Présentation'
						: 'Conférence',
			}}
			onFinish={updateEvent}
		>
			<div
				className="event-form__header"
				style={{
					backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
					backgroundColor: 'var(--ant-layout-sider-bg)',
				}}
			>
				<ConfigProvider
					theme={{
						algorithm: theme === 'light' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
					}}
				>
					<AntdForm.Item<IEventFormFields | null>
						name="event_title"
						rules={[{ required: true, message: "Veuillez saisir un nom d'évenement." }]}
						className="event-title-input"
					>
						<Typography.Title
							level={2}
							editable={{
								onChange: (value) => {
									setEventTitle(value)
									form.setFieldValue('event_title', value)
								},
							}}
						>
							{eventTitle}
						</Typography.Title>
					</AntdForm.Item>

					<AntdForm.Item<IEventFormFields | null>
						name="event_background"
						className="upload-background-btn"
					>
						<Upload
							customRequest={async ({ file, onSuccess, onError, onProgress }) => {
								if (file instanceof File) {
									const fileExtension = getFileExtension(file.name)
									const fileId = translator.new()

									const req = new XMLHttpRequest()
									req.upload.onprogress = (event) => {
										onProgress?.({ percent: (event.loaded / event.total) * 100 })
									}
									req.upload.onerror = (event) => {
										onError?.(event)
										log.error('error', event)
									}
									req.upload.onload = () => {
										onSuccess?.('ok')
									}

									req.open(
										'POST',
										`${
											import.meta.env.VITE_SUPABASE_URL
										}/storage/v1/object/pictures/background_${fileId}.${fileExtension}`,
									)

									req.setRequestHeader('Authorization', `Bearer ${session?.access_token}`)
									if (fileExtension) {
										req.setRequestHeader(
											'Content-Type',
											`image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`,
										)
									}

									req.send(file)

									// when the request is successful, we can set the backgroundUrl
									req.onreadystatechange = () => {
										if (req.readyState === 4 && req.status === 200) {
											const publicUrl = `${
												import.meta.env.VITE_SUPABASE_URL
											}/storage/v1/object/public/pictures/background_${fileId}.${fileExtension}`
											setBackgroundUrl(publicUrl)
										}
									}
								}
							}}
							onRemove={removeBackground}
							accept="image/png, image/jpeg"
							fileList={backgroundUrl ? [{ uid: '-1', name: 'Image', status: 'done' }] : []}
						>
							<IconButton type="text" icon={<UploadOutlined />} />
						</Upload>
					</AntdForm.Item>
				</ConfigProvider>
			</div>
			<div className="event-form__body">
				<Divider>Quand</Divider>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={9}>
						<AntdForm.Item<IEventFormFields | null>
							label="Date de l'événement"
							name="event_date"
							rules={[{ required: true, message: 'Veuillez saisir la date de votre événement.' }]}
						>
							<DatePicker format={formatDate} showTime />
						</AntdForm.Item>
					</Col>
					<Col span={5}>
						<AntdForm.Item<IEventFormFields | null>
							label="Durée"
							name="event_duration"
							rules={[
								{
									required: true,
									message: "Veuillez saisir la durée de l'événement.",
								},
							]}
						>
							<InputNumber addonAfter="h" step={0.5} />
						</AntdForm.Item>
					</Col>
					<Col span={10}>
						<AntdForm.Item<IEventFormFields | null>
							label="Type d'événement"
							name="event_type"
							rules={[
								{ required: true, message: 'Veuillez sélectionner le type de votre événement.' },
							]}
						>
							<SelectField
								placeholder="Sélectionner un type"
								options={Object.keys(eventTypeLabelRecord).map((key) => ({
									label: eventTypeLabelRecord[key as keyof typeof eventTypeLabelRecord],
									value: key as keyof typeof eventTypeLabelRecord,
								}))}
							/>
						</AntdForm.Item>
					</Col>
				</Row>
				<Divider>Où</Divider>
				<AntdForm.Item<IEventFormFields | null>
					label="Adresse"
					name="event_address"
					rules={[{ required: true, message: "Veuillez saisir l'adresse de votre événement." }]}
				>
					<AutoCompleteField
						onSearch={(value) => setAddressSearch(value)}
						onSelect={(value) => setAddressSearch(value)}
						options={addressCompletion.map((address) => ({
							label: `${address.name}, ${address.postcode} ${address.city}`,
							value: `${address.name}, ${address.postcode} ${address.city}`,
						}))}
					/>
				</AntdForm.Item>

				<AntdForm.Item<IEventFormFields | null>
					label="Établissement"
					name="event_school_name"
					rules={[{ required: true, message: "Veuillez saisir le nom de l'établissement." }]}
				>
					<Input />
				</AntdForm.Item>

				<Divider>Description</Divider>
				<AntdForm.Item<IEventFormFields | null>
					// label="Description de l'événement"
					name="event_description"
					rules={[{ required: true, message: "Veuillez saisir une description d'évenement." }]}
				>
					<Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
				</AntdForm.Item>
			</div>
			<div className="event-form__footer">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={10}>
						<AntdForm.Item>
							<Button onClick={() => navigate('/events')} block>
								Annuler
							</Button>
						</AntdForm.Item>
					</Col>
					<Col span={14}>
						<AntdForm.Item>
							<Button htmlType="submit" type="primary" block>
								Mettre à jour l'événement
							</Button>
						</AntdForm.Item>
					</Col>
				</Row>
			</div>
		</AntdForm>
	)
}
