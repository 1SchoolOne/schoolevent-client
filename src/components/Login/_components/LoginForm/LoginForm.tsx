import { Button, Form, Input } from 'antd'

export function LoginForm() {
	const [form] = Form.useForm()

	return (
		<Form form={form} name="login" size="large" layout="vertical" autoComplete="off">
			<Form.Item
				label="Email"
				name="email"
				rules={[{ required: true, message: 'Veuillez saisir votre email.' }]}
			>
				<Input />
			</Form.Item>

			<Form.Item
				label="Mot de passe"
				name="password"
				rules={[{ required: true, message: 'Veuillez saisir votre mot de passe.' }]}
			>
				<Input.Password />
			</Form.Item>

			<Form.Item>
				<Button htmlType="submit" type="primary" block>
					Connexion
				</Button>
			</Form.Item>
		</Form>
	)
}
