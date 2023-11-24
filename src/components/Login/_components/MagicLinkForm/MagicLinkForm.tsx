import { Button, Form, Input } from 'antd'

import { useSupabase } from '@utils'

import { IMagicLinkFormFields } from '../types'

export function MagicLinkForm() {
	const [form] = Form.useForm()
	const supabase = useSupabase()

	const inDevMode = import.meta.env.DEV

	const onFinish = async (values: IMagicLinkFormFields) => {
		const { email } = values

		if (!email) return

		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
				emailRedirectTo: inDevMode ? 'http://localhost:5173/' : 'https://schoolevent.app/',
			},
		})

		if (error) {
			console.error(error)
			return
		}
	}

	return (
		<Form
			form={form}
			name="magiclink"
			size="large"
			layout="vertical"
			autoComplete="off"
			onFinish={onFinish}
			initialValues={{ email: '' }}
		>
			<Form.Item<IMagicLinkFormFields>
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Veuillez saisir votre email.' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					Envoyer le lien
				</Button>
			</Form.Item>
		</Form>
	)
}
