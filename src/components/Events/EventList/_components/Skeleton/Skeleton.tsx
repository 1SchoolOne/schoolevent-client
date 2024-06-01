import { Card, Col, Row, Skeleton as Skel } from 'antd'

import './Skeleton-styles.less'

export function Skeleton() {
	const yearSkeleton = <Skel.Input active style={{ width: 85, height: 30 }} />
	const monthSkeleton = <Skel.Input active style={{ width: 70, height: 30, margin: '12px 0' }} />
	const cardSkeleton = (
		<Card
			className="card-skeleton"
			cover={
				<Skel.Input
					className="card-skeleton__cover"
					active
					style={{ width: '100%', height: 150, borderRadius: 0 }}
				/>
			}
		>
			<Skel active />
		</Card>
	)

	return (
		<div className="event-list-skeleton">
			<div className="event-list-skeleton__shadow"></div>
			{yearSkeleton}
			<div className="event-list-skeleton__months-container">
				{monthSkeleton}
				<Row
					className="event-list-skeleton__months-container__grid"
					gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
				>
					<Col span={8}>{cardSkeleton}</Col>
					<Col span={8}>{cardSkeleton}</Col>
					<Col span={8}>{cardSkeleton}</Col>
				</Row>
				{monthSkeleton}
				{monthSkeleton}
				{monthSkeleton}
				<Row
					className="event-list-skeleton__months-container__grid"
					gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
				>
					<Col span={8}>{cardSkeleton}</Col>
					<Col span={8}>{cardSkeleton}</Col>
					<Col span={8}>{cardSkeleton}</Col>
				</Row>
			</div>
		</div>
	)
}
