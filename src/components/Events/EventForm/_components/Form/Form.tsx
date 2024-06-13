import {
	Plus as CreateIcon,
	Check as UpdateIcon,
	UploadSimple as UploadIcon,
} from '@phosphor-icons/react'
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
	Select,
	Space,
	Typography,
	Upload,
} from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AutoCompleteField, IconButton, SelectField } from '@components'
import { getNameFromEmail, useAssignees } from '@utils'

import { IFormProps, eventTypeLabelRecord } from './Form-types'
import { useFormController } from './Form-utils'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Form(props: IFormProps) {
	const { eventId } = props

	const { form, formValues, fileList, setFileList, setAddressSearch, addressCompletion, onSubmit } =
		useFormController(eventId)

	const [backgroundUrl, setBackgroundUrl] = useState<string | ArrayBuffer | null | undefined>(
		undefined,
	)
	const navigate = useNavigate()
	const { data: assignees } = useAssignees()

	const formatDate = 'DD/MM/YYYY à HH:mm'

	useEffect(() => {
		if (fileList.blob[0]) {
			const reader = new FileReader()

			reader.onload = (ev) => {
				setBackgroundUrl(ev.target?.result)
			}

			reader.readAsDataURL(fileList.blob[0])
		} else {
			setBackgroundUrl(undefined)
		}
	}, [fileList.blob])

	const assigneeOptions: Array<{ label: ReactNode; value: number | null }> =
		assignees?.map((a) => ({
			label: (
				<Space>
					<Typography.Text>{getNameFromEmail(a.email).name}</Typography.Text>
					<Typography.Text type="secondary">({a.email})</Typography.Text>
				</Space>
			),
			value: a.id,
		})) ?? []

	assigneeOptions.push({ label: 'Aucun', value: null })

	return (
		<AntdForm
			className="event-form"
			form={form}
			name="event"
			size="large"
			layout="vertical"
			autoComplete="off"
			initialValues={{
				event_duration: 1.0,
				event_title: "Titre de l'événement",
				event_address: '',
				event_school_name: '',
				event_background: '',
				event_date: '',
				event_description: '',
			}}
			onFinish={onSubmit}
		>
			<div
				className="event-form__header"
				style={{
					backgroundImage: `url(${backgroundUrl})`,
					backgroundColor: 'var(--ant-layout-sider-bg)',
				}}
			>
				<ConfigProvider
					theme={{
						components: {
							Typography: {
								colorText: '#fff',
								colorTextHeading: '#fff',
							},
							Button: {
								colorText: '#fff',
							},
							Upload: {
								colorText: '#fff',
							},
						},
					}}
				>
					<AntdForm.Item
						name="event_title"
						rules={[{ required: true, message: "Veuillez saisir un nom d'évenement." }]}
						className="event-title-input"
						data-testid="event_title"
					>
						<Typography.Title
							level={2}
							editable={{
								onChange: (value) => {
									form.setFieldValue('event_title', value)
								},
							}}
						>
							{formValues?.event_title}
						</Typography.Title>
					</AntdForm.Item>
					<AntdForm.Item
						name="event_background"
						className="upload-background-btn"
						data-testid="event_background"
					>
						<Upload
							fileList={fileList.rcFile}
							beforeUpload={async (file) => {
								const blob = [new Blob([await file.arrayBuffer()], { type: file.type })]

								setFileList({ rcFile: [file], blob })

								return false
							}}
							onRemove={() => {
								setFileList({ rcFile: [], blob: [] })
							}}
							accept="image/png, image/jpeg"
						>
							<IconButton type="text" icon={<UploadIcon size={16} />} />
						</Upload>
					</AntdForm.Item>
				</ConfigProvider>
			</div>
			<div className="event-form__body">
				<Divider>Quand</Divider>
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={9}>
						<AntdForm.Item
							label="Date de l'événement"
							name="event_date"
							rules={[{ required: true, message: 'Veuillez saisir la date de votre événement.' }]}
							data-testid="event_date"
						>
							<DatePicker format={formatDate} showTime={{ minuteStep: 5 }} />
						</AntdForm.Item>
					</Col>
					<Col span={5}>
						<AntdForm.Item
							label="Durée"
							name="event_duration"
							rules={[
								{
									required: true,
									message: "Veuillez saisir la durée de l'événement.",
								},
							]}
							data-testid="event_duration"
						>
							<InputNumber addonAfter="h" step={0.5} />
						</AntdForm.Item>
					</Col>
					<Col span={10}>
						<AntdForm.Item
							label="Type d'événement"
							name="event_type"
							rules={[
								{ required: true, message: 'Veuillez sélectionner le type de votre événement.' },
							]}
							data-testid="event_type"
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
				<Divider>Référent</Divider>
				<AntdForm.Item name="event_assignee" data-testid="event_assignee">
					<Select placeholder="Sélectionner un référent" options={assigneeOptions} />
				</AntdForm.Item>
				<Divider>Où</Divider>
				<AntdForm.Item
					label="Adresse"
					name="event_address"
					rules={[{ required: true, message: "Veuillez saisir l'adresse de votre événement." }]}
					data-testid="event_address"
				>
					<AutoCompleteField
						onSearch={(value) => setAddressSearch(value)}
						onSelect={(value) => setAddressSearch(value)}
						options={addressCompletion?.map((address) => ({
							label: `${address.name}, ${address.postcode} ${address.city}`,
							value: `${address.name}, ${address.postcode} ${address.city}`,
						}))}
					/>
				</AntdForm.Item>

				<AntdForm.Item
					label="Établissement"
					name="event_school_name"
					rules={[{ required: true, message: "Veuillez saisir le nom de l'établissement." }]}
					data-testid="event_school_name"
				>
					<Input />
				</AntdForm.Item>

				<Divider>Description</Divider>
				<AntdForm.Item
					name="event_description"
					rules={[{ required: true, message: "Veuillez saisir une description d'évenement." }]}
					data-testid="event_description"
				>
					<Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
				</AntdForm.Item>
			</div>
			<div className="event-form__footer">
				<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					<Col span={10}>
						<AntdForm.Item>
							<Button
								onClick={() => {
									if (eventId) {
										navigate(`/events/view/${eventId}`)
									} else {
										navigate('/events')
									}
								}}
								block
							>
								Annuler
							</Button>
						</AntdForm.Item>
					</Col>
					<Col span={14}>
						<AntdForm.Item>
							<Button
								icon={eventId ? <UpdateIcon size={16} /> : <CreateIcon size={16} />}
								htmlType="submit"
								type="primary"
								block
							>
								{eventId ? 'Enregistrer' : "Créer l'événement"}
							</Button>
						</AntdForm.Item>
					</Col>
				</Row>
			</div>
		</AntdForm>
	)
}
