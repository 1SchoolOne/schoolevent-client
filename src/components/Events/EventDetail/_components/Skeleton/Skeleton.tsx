import { ArrowLeft } from '@phosphor-icons/react'
import { Col, Divider, Row, Skeleton as Skel } from 'antd'
import { Link } from 'react-router-dom'

import { useAuth } from '@contexts'

import './Skeleton-styles.less'

export function Skeleton() {
	const { role } = useAuth()

	const banner = <Skel.Input className="event-detail-skeleton__banner" active />
	const smallSkeleton = <Skel.Input className="event-detail-skeleton__small-skeleton" active />

	return (
		<div className="event-detail-skeleton">
			<Link className="event-detail-skeleton__back-btn" to="/events">
				<ArrowLeft size={16} />
				Retour
			</Link>
			{banner}
			<Row className="event-detail-skeleton__body" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
				<Col span={16}>
					<Divider>Description</Divider>
					<div className="event-detail-skeleton__body__description">
						<Skel active />
					</div>
				</Col>
				<Col span={8}>
					<Divider>Référent</Divider>
					<div className="event-detail-skeleton__body__assignee">{smallSkeleton}</div>
					{role !== 'student' && (
						<>
							<Divider>Participants</Divider>
							<div className="event-detail-skeleton__body__participants">
								{smallSkeleton}
								{smallSkeleton}
								{smallSkeleton}
								{smallSkeleton}
								{smallSkeleton}
							</div>
						</>
					)}
				</Col>
			</Row>
		</div>
	)
}
