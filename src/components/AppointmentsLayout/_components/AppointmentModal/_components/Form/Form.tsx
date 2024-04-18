import { useQuery } from '@tanstack/react-query'
import { Form as AntdForm, Col, Divider, Input, Row, Skeleton, Tabs, Typography } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'

import { AutoCompleteField, Info, SelectField } from '@components'
import { useAppointmentForm } from '@contexts'
import { appointmentStatusRecord } from '@types'
import {
	fetchAddressCompletion,
	fetchGeoIP,
	getNameFromEmail,
	useDebounce,
	useSupabase,
} from '@utils'

import { DateField } from '../DateField/DateField'
import { IFormValues, TFormProps } from './Form-types'

dayjs.extend(utc)
dayjs.extend(timezone)

export function Form(props: TFormProps) {
	const { formInstance, isLoading, onFinish, mode } = props

	const { initialValues } = useAppointmentForm()
	const [addressSearch, setAddressSearch] = useState(initialValues?.school_address ?? '')
	const debouncedSearch = useDebounce(addressSearch, 500)

	const supabase = useSupabase()

	const { data: userLocation } = useQuery({ queryKey: ['user-geoip'], queryFn: fetchGeoIP })

	const { data: addressCompletion } = useQuery({
		queryKey: ['addresse-completion', { search: debouncedSearch }],
		queryFn: async () =>
			await fetchAddressCompletion(
				debouncedSearch,
				userLocation,
				formInstance.getFieldValue('school_postal_code'),
			),
		enabled: !!debouncedSearch && !!userLocation,
		placeholderData: [],
	})

	const { data: assignees, isFetching } = useQuery({
		queryKey: ['assignees'],
		queryFn: async () => {
			const { data, error } = await supabase.from('users').select('id,email').eq('role', 'manager')

			if (error) {
				throw error
			}

			return data
		},
		placeholderData: [],
		staleTime: 1000 * 10,
	})

	/**
	 * Antd's Form component uses `initialValues` prop as defaultValue.
	 * If the value passed has changed it won't update the fields values.
	 * So we reset the fields when the data has fully loaded.
	 */
	useEffect(
		function refreshForm() {
			formInstance.resetFields()
		},
		[initialValues, formInstance],
	)

	return (
		<AntdForm<IFormValues>
			className="appointment-modal__form"
			layout="vertical"
			form={formInstance}
			onFinish={onFinish}
			initialValues={{
				...initialValues,
				contacted_date: initialValues?.contacted_date
					? dayjs(initialValues.contacted_date)
					: undefined,
				planned_date: initialValues?.planned_date ? dayjs(initialValues.planned_date) : undefined,
			}}
		>
			<Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={13}>
					<Tabs
						defaultActiveKey="1"
						items={[
							{
								key: 'required_fields',
								label: 'Établissement',
								forceRender: true,
								children: (
									<>
										<AntdForm.Item
											name="school_name"
											label="Établissement"
											rules={[
												{ required: true, message: "Veuillez saisir le nom de l'établissement." },
											]}
										>
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>

										<AntdForm.Item
											name="school_address"
											label="Adresse"
											rules={[{ required: true, message: "Veuillez saisir l'adresse." }]}
										>
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<AutoCompleteField
													readOnly={mode === 'view'}
													value={addressSearch}
													emptyText="Aucune adresse renseignée"
													onSearch={(value) => setAddressSearch(value)}
													onSelect={(value) => setAddressSearch(value)}
													options={addressCompletion?.map((address) => ({
														label: address.label,
														value: address.name,
													}))}
												/>
											)}
										</AntdForm.Item>

										<AntdForm.Item
											name="school_postal_code"
											label="Code postal"
											rules={[{ required: true, message: 'Veuillez saisir le code postal.' }]}
										>
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>
										<AntdForm.Item
											name="school_city"
											label="Ville"
											rules={[{ required: true, message: 'Veuillez saisir la ville.' }]}
										>
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>
									</>
								),
							},
							{
								key: 'optional_fields',
								label: 'Contact',
								forceRender: true,
								children: (
									<>
										<AntdForm.Item name="contact_name" label="Nom du contact">
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>

										<AntdForm.Item name="contact_phone" label="Téléphone">
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>

										<AntdForm.Item name="contact_email" label="Email">
											{isLoading ? (
												<Skeleton.Input active block />
											) : (
												<Input readOnly={mode === 'view'} allowClear />
											)}
										</AntdForm.Item>
									</>
								),
							},
							{
								key: 'notes_field',
								label: 'Note',
								forceRender: true,
								children: (
									<AntdForm.Item name="note" label="Note">
										{isLoading ? (
											<Skeleton.Input active block />
										) : (
											<Input.TextArea
												autoSize={{ minRows: 13, maxRows: 13 }}
												readOnly={mode === 'view'}
												allowClear
											/>
										)}
									</AntdForm.Item>
								),
							},
						]}
					/>
				</Col>

				<Col
					span={1}
					style={{
						padding: 'var(--ant-padding-sm) 0',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Divider type="vertical" style={{ height: '100%' }} />
				</Col>

				<Col span={10}>
					<AntdForm.Item
						name="apt_status"
						label="Statut"
						rules={[{ required: true, message: 'Veuillez sélectionner le statut.' }]}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<SelectField
								readOnly={mode === 'view'}
								placeholder="Sélectionner un statut"
								options={Object.entries(appointmentStatusRecord).map(([key, value]) => ({
									key,
									label: value,
									value: key,
								}))}
								allowClear
							/>
						)}
					</AntdForm.Item>

					<AntdForm.Item name="assignee" label="Assigné">
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<SelectField
								readOnly={mode === 'view'}
								placeholder="Sélectionner un assigné"
								emptyText="Aucun assigné"
								loading={isFetching}
								filterOption={(input, option) => {
									if (!option) return false

									return (option.label as string).toLowerCase().includes(input.toLowerCase())
								}}
								options={assignees?.map((assignee) => {
									const { name } = getNameFromEmail(assignee.email)

									return {
										label: `${name} (${assignee.email})`,
										title: `${name} (${assignee.email})`,
										value: assignee.id,
									}
								})}
								showSearch
								allowClear
							/>
						)}
					</AntdForm.Item>

					<AntdForm.Item name="apt_type" label="Type de rendez-vous">
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<Input
								readOnly={mode === 'view'}
								placeholder="Ex: téléphonique, teams, ..."
								allowClear
							/>
						)}
					</AntdForm.Item>

					<AntdForm.Item
						name="contacted_date"
						label={
							<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}>
								<Typography.Text>Contacté le</Typography.Text>
								<Info tooltip>
									<span>
										La date à laquelle vous avez contacté l'établissement pour la première fois.
									</span>
								</Info>
							</div>
						}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<DateField readOnly={mode === 'view'} block />
						)}
					</AntdForm.Item>

					<AntdForm.Item
						name="planned_date"
						label={
							<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ant-margin-xs)' }}>
								<Typography.Text>Planifié le</Typography.Text>
								<Info tooltip>
									<span>La date à laquelle le rendez-vous est prévu.</span>
								</Info>
							</div>
						}
					>
						{isLoading ? (
							<Skeleton.Input active block />
						) : (
							<DateField readOnly={mode === 'view'} block />
						)}
					</AntdForm.Item>
				</Col>
			</Row>
		</AntdForm>
	)
}
