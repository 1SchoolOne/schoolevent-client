import { Descriptions, Form, Select, Tag } from 'antd'

import { IEditRoleModalContentProp } from './EditRoleModalContent-types'

export function EditRoleModalContent({ user }: IEditRoleModalContentProp) {
	return (
		<>
			<Descriptions
				column={1}
				items={[
					{
						label: 'Nom',
						children: user.userName,
					},
					{
						label: 'Email',
						children: user.email,
					},
					{
						label: 'Rôle',
						children:
							user.role === 'admin' ? (
								<Tag color="red">Admin</Tag>
							) : user.role === 'manager' ? (
								<Tag color="orange">Manager</Tag>
							) : (
								<Tag color="green">Étudiant</Tag>
							),
					},
				]}
			/>
			<Form.Item
				label="Nouveau rôle"
				name="role"
				rules={[{ required: true, message: 'Veuillez sélectionner le nouveau rôle.' }]}
			>
				<Select<(typeof user)['role']>
					placeholder="Sélectionner un nouveau rôle"
					options={[
						{ label: <Tag color="green">Étudiant</Tag>, value: 'student' },
						{ label: <Tag color="orange">Manager</Tag>, value: 'manager' },
						{ label: <Tag color="red">Admin</Tag>, value: 'admin' },
					]}
				/>
			</Form.Item>
		</>
	)
}
