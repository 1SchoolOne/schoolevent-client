import { Typography } from 'antd'

import './HistoricEventCell-styles.less'

const { Text, Title } = Typography

export function HistoricEventCell() {
	return (
		<div className="event-cell">
			<div className="event-infos">
				<Text strong>Portes-ouvertes</Text>
				<Text>16 décembre 2023 - Campus Pontoise</Text>
				<div className="description">
					<Text>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
						exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
					</Text>
				</div>
			</div>
			<section className="points-won">
        <Title level={4}>Points gagnés : </Title>
        <Title level={3} className='points'>0</Title>
      </section>
		</div>
	)
}
