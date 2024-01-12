import { UploadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Select, TimePicker, Upload } from 'antd'
import dayjs from 'dayjs'

import { useSupabase } from '@utils'

import { EEventTypes, IEventFormFields } from './_components/EventForm-types'

export function EventForm() {
	const [form] = Form.useForm()

	const formatDate = 'DD/MM/YYYY'
	const date = dayjs(Date.now())
	const formatTime = 'HH:mm'
	const supabase = useSupabase()

	const createEvent = async (value: IEventFormFields) => {
		let backgroundUrl: string | null = null

		if (value.background) {
			const { data, error } = await supabase.storage
				.from('pictures')
				.upload(value.background.file.name, value.background.file)
			backgroundUrl = error ? null : data?.path
		}

		await supabase.from('events').insert({
			...value,
			background: backgroundUrl,
			time: dayjs(value.time).format(formatTime),
		})
	}

	return (
		<Form
			form={form}
			name="event"
			size="large"
			layout="vertical"
			autoComplete="off"
			initialValues={{
				name: '',
				position: '',
				background: '',
				date: date,
				time: date,
				eventType: '',
			}}
			onFinish={createEvent}
		>
			<Form.Item<IEventFormFields>
				label="Nom de l'événement"
				name="name"
				rules={[{ required: true, message: "Veuillez saisir un nom d'évenement." }]}
			>
				<Input />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Type d'événement"
				name="eventType"
				rules={[{ required: true, message: 'Veuillez saisir le type de votre événement.' }]}
			>
				<Select>
					{Object.values(EEventTypes).map((type) => (
						<Select.Option key={type} value={type}>
							{type}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Lieux"
				name="position"
				rules={[{ required: true, message: 'Veuillez saisir le lieux de votre événement.' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="Date de l'événement"
				name="date"
				rules={[{ required: true, message: 'Veuillez saisir la date de votre événement.' }]}
			>
				<DatePicker format={formatDate} />
			</Form.Item>

			<Form.Item<IEventFormFields>
				label="heure de l'événement"
				name="time"
				rules={[
					{
						required: true,
						message: "Veuillez saisir l'heure de début et de fin de votre événement.",
					},
				]}
			>
				<TimePicker format={formatTime} />
			</Form.Item>

			<Form.Item<IEventFormFields> label="Image de fond" name="background">
				<Upload beforeUpload={() => false}>
					<Button icon={<UploadOutlined />}>Sélectionner un fichier</Button>
				</Upload>
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					Crée
				</Button>
			</Form.Item>
		</Form>
	)
}
