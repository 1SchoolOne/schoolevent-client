import { useMutation, useQuery } from '@tanstack/react-query'
import { Form, Input, Modal, Select, Typography } from 'antd'
import { useState } from 'react'

import { useAuth } from '@contexts'
import { useSupabase } from '@utils'

import './Onboarding-styles.less'

export function Onboarding() {
	const [isOpen, setIsOpen] = useState(true)
	const { studentData } = useAuth()
	const supabase = useSupabase()

	const { data: courses, isPending: isCoursesPending } = useQuery({
		queryKey: ['courses'],
		queryFn: async () => {
			const { data, error } = await supabase.from('courses').select()

			if (error) {
				throw error
			}

			return data
		},
		enabled: !!studentData,
	})

	const { mutate: updateStudentData, isPending: isUpdatingStudentData } = useMutation({
		mutationFn: async (values: { phone: string; course_id: number }) => {
			if (!studentData) {
				return
			}

			const { phone, course_id } = values

			const { error } = await supabase
				.from('students')
				.update({ phone, course_id })
				.eq('user_id', studentData.user_id)

			if (error) {
				throw error
			}
		},
		onSuccess: () => {
			setIsOpen(false)
		},
	})

	if (studentData === null || (studentData?.phone && studentData?.course_id)) {
		return null
	}

	return (
		<Modal
			className="onboarding-modal"
			title="Avant de commencer..."
			closable={false}
			confirmLoading={isUpdatingStudentData}
			footer={(_originNode, { OkBtn }) => <OkBtn />}
			okButtonProps={{ htmlType: 'submit', className: 'submit-btn' }}
			okText="Confirmer"
			modalRender={(dom) => (
				<Form<{ phone: string; course_id: number }> layout="vertical" onFinish={updateStudentData}>
					{dom}
				</Form>
			)}
			open={isOpen}
		>
			<Typography.Paragraph>
				Il nous faut ton numéro de téléphone et ta formation actuelle. Les managers en auront besoin
				pour te faire parvenir des informations supplémentaires concernant les événements auxquels
				tu t'es inscrit.
			</Typography.Paragraph>

			<Form.Item
				name="phone"
				label="N° de téléphone"
				rules={[{ required: true, message: 'Veuillez saisir votre numéro de téléphone.' }]}
			>
				<Input placeholder="06 12 34 56 78" />
			</Form.Item>

			<Form.Item
				name="course_id"
				label="Formation"
				rules={[{ required: true, message: 'Veuillez sélectionner votre formation.' }]}
			>
				<Select
					placeholder="Sélectionner une formation"
					options={courses?.map((c) => ({ label: c.name, value: c.id }))}
					loading={isCoursesPending}
				/>
			</Form.Item>
		</Modal>
	)
}
