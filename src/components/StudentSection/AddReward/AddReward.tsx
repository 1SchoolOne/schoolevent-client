import { ArrowLeft } from '@phosphor-icons/react'
import { UploadSimple as UploadIcon } from '@phosphor-icons/react/UploadSimple'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	Form as AntdForm,
	App,
	Button,
	Col,
	Grid,
	InputNumber,
	Row,
	Space,
	Typography,
	Upload,
} from 'antd'
import classNames from 'classnames'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '@contexts'
import { TReward } from '@types'
import { useSupabase } from '@utils'

import { IconButton } from '../../IconButton/IconButton'

import './AddReward-styles.less'

const { useBreakpoint } = Grid

export function AddReward() {
	const supabase = useSupabase()
	const { role } = useAuth()
	const navigate = useNavigate()
	const screens = useBreakpoint()
	const queryClient = useQueryClient()
	const { message } = App.useApp()
	const [formInstance] = AntdForm.useForm<Omit<TReward, 'id'>>()
	const formValues = AntdForm.useWatch((values) => values, formInstance)

	const { mutate: addReward } = useMutation({
		mutationFn: async (values: Omit<TReward, 'id'>) => {
			const { data, error } = await supabase.from('rewards').insert(values).select().single()

			if (error) {
				throw error
			}

			return data
		},
		onSuccess: async (data) => {
			await queryClient.resetQueries({ queryKey: ['rewards'] }).then(() => {
				message.success(`La récompense "${data.reward_name}" a été créée avec succès`)
			})
		},
		onError: async () => {
			await message.error("Une erreur est survenue lors de l'ajout de la récompense")
		},
	})

	if ([null, 'student'].includes(role)) {
		navigate('/rewards')
		return null
	}

	return (
		<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
			<Col span={5}>
				<Link className="previous-btn" to="/rewards">
					<ArrowLeft size={16} />
					Retour
				</Link>
			</Col>
			<Col span={14}>
				<AntdForm<Omit<TReward, 'id'>>
					form={formInstance}
					className="reward-form"
					name="reward"
					layout="vertical"
					autoComplete="off"
					onFinish={addReward}
				>
					<Space
						size="large"
						className={classNames('reward-form__fields-container', {
							'reward-form__fields-container--vertical': !screens.xl,
							'reward-form__fields-container--horizontal': screens.xl,
						})}
						direction={screens.xl ? 'horizontal' : 'vertical'}
					>
						<div className="reward-form__background-upload">
							<AntdForm.Item className="reward-form__background-upload__form-item">
								<Upload accept="image/png, image/jpeg">
									<IconButton type="text" icon={<UploadIcon color="white" size={16} />} disabled />
								</Upload>
							</AntdForm.Item>
						</div>
						<div>
							<AntdForm.Item
								name="reward_name"
								className="reward-form__title-item"
								validateTrigger={['onChange']}
								rules={[{ required: true, message: 'Veuillez saisir le nom de la récompense.' }]}
							>
								<Typography.Title
									className="reward-form__title"
									level={4}
									editable={{
										onChange: (value) => formInstance.setFieldValue('reward_name', value),
									}}
								>
									{formValues?.reward_name ?? 'Nom de la récompense'}
								</Typography.Title>
							</AntdForm.Item>
							<div className="reward-form__pts-and-qty">
								<AntdForm.Item
									name="reward_points"
									label="Prix (en points)"
									validateTrigger={['onChange']}
									rules={[{ required: true, message: '' }]}
								>
									<InputNumber placeholder="0" min={0} />
								</AntdForm.Item>
								<AntdForm.Item
									name="reward_number"
									label="Quantité"
									validateTrigger={['onChange']}
									rules={[{ required: true, message: '' }]}
								>
									<InputNumber placeholder="0" min={0} />
								</AntdForm.Item>
							</div>
						</div>
					</Space>
					<Button className="reward-form__submit-btn" htmlType="submit" type="primary">
						Ajouter
					</Button>
				</AntdForm>
			</Col>
			<Col span={5}></Col>
		</Row>
	)
}
