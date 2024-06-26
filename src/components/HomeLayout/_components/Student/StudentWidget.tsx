import { UserAddOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import { valueType } from 'antd/lib/statistic/utils'
import { log, useSupabase } from '@utils'
import CountUp from 'react-countup'
import { useQuery } from '@tanstack/react-query'

import '../../HomeLayout-styles.less'

const formatter = (value: valueType) => {
	const numberValue = Number(value)
	return isNaN(numberValue) ? value : <CountUp end={numberValue} separator="," />
}

export const StudentWidget: React.FC = () => {
	const supabase = useSupabase()


	const { data: studentsCount } = useQuery({
		queryKey: ['students'],
		queryFn: async () => {
			const { count, error } = await supabase
				.from('students')
				.select('*', { count: 'exact' })

			if (error) {
				log.error('Error fetching events_participants', error)
				throw error
			}

			return count ?? 0
		},
	})

	return (
		<Card
			title="Nombre d'inscriptions de nouveaux étudiants"
			size="small"
			bordered={false}
			className="global-little-widget"
		>
			<Row gutter={[16, 16]}>
				<Col xs={24}>
					<Statistic
						className="margin-bottom"
						title="Nombre d'inscriptions d'étudiants :"
						value={studentsCount}
						prefix={<UserAddOutlined />}
						formatter={formatter}
					/>
					<hr className="margin-bottom" />
				</Col>
			</Row>
		</Card>
	)
}
