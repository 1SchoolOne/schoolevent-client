import { useQuery } from '@tanstack/react-query'
import { InputRef } from 'antd'
import dayjs from 'dayjs'
import { useRef } from 'react'

import {
	BasicLayout,
	Table,
	getColumnSearchFilterConfig,
	getRadioOrCheckboxFilterConfig,
} from '@components'
import { TStudent } from '@types'
import { getNameFromEmail, log, useSupabase } from '@utils'

import { formatNumberWithDots } from '../Table/Table-utils'
import { parseFilters } from './StudentTable-utils'

import './StudentTable-styles.less'

export function StudentTable() {
	const supabase = useSupabase()
	const inputRef = useRef<InputRef>(null)
	const { data: courses } = useQuery({
		queryKey: ['courses'],
		queryFn: async () => {
			const { data, error } = await supabase.from('courses').select()

			if (error) {
				log.error(error)
				throw error
			}

			return data
		},
	})

	return (
		<BasicLayout className="student-table-layout" contentClassName="student-table-layout__content">
			<Table<TStudent & { email: string; courseName?: string; userName: string }>
				tableId="students"
				dataSource={async (filters, sorter, pagination, currentPage) => {
					const from = (currentPage - 1) * pagination!.size
					const to = from + pagination!.size

					const request = supabase
						.from('students')
						.select('*, users!inner(email), courses(name)', { count: 'exact' })
						.range(from, to)
					const parsedFilters = parseFilters(filters)

					if (filters && parsedFilters) {
						request.or(parsedFilters)
					}

					if (filters?.email) {
						request.ilike('users.email', `%${filters?.email}%`)
					}

					if (sorter) {
						request.order(sorter.field, {
							ascending: sorter.order === 'ascend',
						})
					}

					const { data, error, count } = await request

					if (error) {
						throw error
					}

					const finalData = data.map((student) => ({
						...student,
						courseName: student.courses?.name,
						email: student.users!.email,
						userName: getNameFromEmail(student.users?.email ?? '').name,
					}))

					return { data: finalData, totalCount: count ?? 0 }
				}}
				showResetFilters
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
						dataIndex: 'courseName',
						title: 'Formation',
						...getRadioOrCheckboxFilterConfig({
							options: courses?.map((c) => ({ label: c.name, value: c.id })) ?? [],
						}),
						render: (value) => value ?? '-',
					},
					{
						dataIndex: 'last_event',
						title: 'Dernier évènement',
						render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '-'),
					},
					{
						dataIndex: 'points',
						title: 'Points',
						sorter: true,
						...getColumnSearchFilterConfig(inputRef),
					},
				]}
				defaultFilters={{
					id: null,
					userName: null,
					email: null,
					courseName: null,
					last_event: null,
					points: null,
				}}
				pagination={{
					showTotal: (total, range) => {
						return `${range[0]}-${range[1]} sur ${formatNumberWithDots(total)} étudiants`
					},
				}}
			/>
		</BasicLayout>
	)
}
