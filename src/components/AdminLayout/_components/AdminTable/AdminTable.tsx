import {
	SealCheck as ApproveIcon,
	Check as ApprovedIcon,
	Prohibit as DeactivateIcon,
	Trash as DeleteIcon,
	X as NotApprovedIcon,
} from '@phosphor-icons/react'
import { Button, Divider, InputRef, Modal, Space, Tag, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useReducer, useRef, useState } from 'react'

import { Table, getColumnSearchFilterConfig, getRadioOrCheckboxFilterConfig } from '@components'
import { TUser } from '@types'
import { getNameFromEmail, useSupabase } from '@utils'

import { formatNumberWithDots, parseFiltersForSupabase } from '../../../Table/Table-utils'
import { TAdminTableData } from './AdminTable-types'
import {
	adminTableReducer,
	useApproveUsers,
	useDeactivateUsers,
	useDeleteUsers,
} from './AdminTable-utils'

import './AdminTable-styles.less'

export function AdminTable() {
	const supabase = useSupabase()
	const [modal, contextHolder] = Modal.useModal()
	const [selectedRows, setSelectedRows] = useState<Array<TAdminTableData>>([])
	const [selectedRowKeys, setSelectedRowKeys] = useState<Array<React.Key>>([])
	const [buttonsStatus, setButtonsStatus] = useReducer(adminTableReducer, {
		approveBtn: { message: 'Sélectionnez des utilisateurs', disabled: true },
		deactivateBtn: { message: 'Sélectionnez des utilisateurs', disabled: true },
		deleteBtn: { message: 'Sélectionnez des utilisateurs', disabled: true },
	})
	const inputRef = useRef<InputRef>(null)

	/**
	 * Sync action buttons status.
	 *
	 * `Approuver` button should be enabled only if the selected rows contains not yet approved users.
	 * `Désactiver` button should be enabled only if the selected rows contains already approved users.
	 * `Supprimer` button should be enabled only if there is at least one selected row.
	 */
	useEffect(
		function syncActionButtonsStatus() {
			const shouldDisableApproveBtn =
				selectedRows.length === 0 || selectedRows.some((row) => row.approved === true)
			const shouldDisableDeactivateBtn =
				selectedRows.length === 0 || selectedRows.some((row) => row.approved === false)
			const shouldDisableDeleteBtn = selectedRows.length === 0

			const defaultMessage = 'Sélectionnez des utilisateurs'

			if (shouldDisableApproveBtn) {
				setButtonsStatus({
					type: 'SET_APPROVE_BTN',
					payload: {
						disabled: true,
						message:
							selectedRows.length === 0
								? defaultMessage
								: "Vous ne pouvez approuver uniquement des utilisateurs en attente d'approbation.",
					},
				})
			} else {
				setButtonsStatus({ type: 'SET_APPROVE_BTN', payload: { disabled: false, message: '' } })
			}

			if (shouldDisableDeactivateBtn) {
				setButtonsStatus({
					type: 'SET_DEACTIVATE_BTN',
					payload: {
						disabled: true,
						message:
							selectedRows.length === 0
								? defaultMessage
								: 'Vous ne pouvez désactiver uniquement des utilisateurs déjà approuvé.',
					},
				})
			} else {
				setButtonsStatus({ type: 'SET_DEACTIVATE_BTN', payload: { disabled: false, message: '' } })
			}

			if (shouldDisableDeleteBtn) {
				setButtonsStatus({
					type: 'SET_DELETE_BTN',
					payload: {
						disabled: true,
						message: defaultMessage,
					},
				})
			} else {
				setButtonsStatus({ type: 'SET_DELETE_BTN', payload: { disabled: false, message: '' } })
			}
		},
		[selectedRows],
	)

	const { mutate: approveUsers } = useApproveUsers(() => {
		setSelectedRows([])
		setSelectedRowKeys([])
	})
	const { mutate: deactivateUsers } = useDeactivateUsers(() => {
		setSelectedRows([])
		setSelectedRowKeys([])
	})
	const { mutate: deleteUsers } = useDeleteUsers(() => {
		setSelectedRows([])
		setSelectedRowKeys([])
	})

	return (
		<>
			{contextHolder}
			<Table<TAdminTableData>
				tableId="admin"
				className="admin-table"
				dataSource={async (filters, _sorter, pagination, currentPage) => {
					const from = (currentPage - 1) * pagination!.size
					const to = from + pagination!.size

					let request = supabase
						.from('users')
						.select('*', { count: 'exact' })
						.order('role')
						.range(from, to)
					const parsedFilters = parseFiltersForSupabase<TUser>(filters)

					// if (filters && parsedFilters) {
					// 	request.or(parsedFilters)
					// }

					// TODO: custom `parseFiltersForSupabase` to implement the next line
					request.like('role_text', 'student')

					const { data, error, count } = await request

					if (error) {
						throw error
					}

					const finalData: Array<TAdminTableData> = data.map((user) => ({
						...user,
						userName: getNameFromEmail(user.email).name,
					}))

					return { data: finalData, totalCount: count ?? 0 }
				}}
				showHeader
				renderHeader={() => (
					<div className="admin-table__header">
						{selectedRows.length > 0 && (
							<Space className="admin-table__header__selected-rows-count" size="small">
								<Typography.Text strong>{selectedRows.length}</Typography.Text>
								<Typography.Text>{`utilisateur${selectedRows.length > 1 ? 's' : ''} séléctionné${
									selectedRows.length > 1 ? 's' : ''
								}`}</Typography.Text>
							</Space>
						)}
						<Space className="admin-table__header__action-buttons">
							<Tooltip title={buttonsStatus.approveBtn.message}>
								<Button
									type="primary"
									icon={<ApproveIcon size={16} />}
									onClick={() => {
										modal.confirm({
											title: 'Approuver',
											content: `Êtes-vous sur de vouloir approuver ${
												selectedRows.length
											} utilisateur${selectedRows.length > 1 ? 's' : ''} ?`,
											centered: true,
											icon: <ApproveIcon size={16} fill="var(--ant-color-warning)" />,
											okText: 'Confirmer',
											onOk: () => {
												approveUsers(selectedRows)
											},
										})
									}}
									disabled={buttonsStatus.approveBtn.disabled}
								>
									Approuver
								</Button>
							</Tooltip>
							<Tooltip title={buttonsStatus.deactivateBtn.message}>
								<Button
									type="dashed"
									icon={<DeactivateIcon size={16} />}
									onClick={() => {
										modal.confirm({
											title: 'Désactiver',
											content: `Êtes-vous sur de vouloir désactiver ${
												selectedRows.length
											} utilisateur${selectedRows.length > 1 ? 's' : ''} ?`,
											centered: true,
											icon: <DeactivateIcon size={16} fill="var(--ant-color-warning)" />,
											okText: 'Confirmer',
											onOk: () => {
												deactivateUsers(selectedRows)
											},
										})
									}}
									disabled={buttonsStatus.deactivateBtn.disabled}
								>
									Désactiver
								</Button>
							</Tooltip>
							<Divider type="vertical" />
							<Tooltip title={buttonsStatus.deleteBtn.message}>
								<Button
									icon={<DeleteIcon size={16} />}
									onClick={() => {
										modal.confirm({
											title: 'Supprimer',
											content: `Êtes-vous sur de vouloir supprimer ${
												selectedRows.length
											} utilisateur${selectedRows.length > 1 ? 's' : ''} ?`,
											centered: true,
											icon: <DeleteIcon size={16} fill="var(--ant-color-error)" />,
											okText: 'Confirmer',
											okButtonProps: { danger: true },
											onOk: () => {
												deleteUsers(selectedRows)
											},
										})
									}}
									disabled={buttonsStatus.deleteBtn.disabled}
									danger
								>
									Supprimer
								</Button>
							</Tooltip>
						</Space>
					</div>
				)}
				columns={[
					{
						dataIndex: 'userName',
						title: 'Nom',
					},
					{
						dataIndex: 'email',
						title: 'Email',
						...getColumnSearchFilterConfig(inputRef),
					},
					{
						// TODO: make this cell editable
						// https://ant.design/components/table#components-table-demo-edit-row
						dataIndex: 'role',
						title: 'Role',
						width: 100,
						render: (value: TAdminTableData['role']) => {
							switch (value) {
								case 'admin':
									return <Tag color="red">Admin</Tag>
								case 'manager':
									return <Tag color="orange">Manager</Tag>
								case 'student':
									return <Tag color="green">Étudiant</Tag>
							}
						},
						...getRadioOrCheckboxFilterConfig({
							options: [
								{ label: 'Étudiant', value: 'student' },
								{ label: 'Manager', value: 'manager' },
								{ label: 'Admin', value: 'admin' },
							],
							useCheckbox: true,
						}),
					},
					{
						dataIndex: 'created_at',
						title: "Date d'inscription",
						render: (value: string) => dayjs(value).format('DD/MM/YYYY [à] HH:mm'),
					},
					{
						dataIndex: 'approved',
						title: 'Approuvé',
						render: (value: boolean) =>
							value ? (
								<ApprovedIcon size={16} fill="var(--ant-color-success)" />
							) : (
								<NotApprovedIcon size={16} fill="var(--ant-color-error)" />
							),
					},
				]}
				rowSelection={{
					type: 'checkbox',
					selectedRowKeys,
					onChange: (newSelectedRowKeys, newSelectedRows) => {
						setSelectedRowKeys(newSelectedRowKeys)
						setSelectedRows(newSelectedRows)
					},
				}}
				pagination={{
					showTotal: (total, range) => {
						return `${range[0]}-${range[1]} sur ${formatNumberWithDots(total)} utilisateurs`
					},
				}}
				defaultFilters={{
					id: null,
					userName: null,
					email: null,
					role: null,
					created_at: null,
					approved: null,
				}}
			/>
		</>
	)
}
