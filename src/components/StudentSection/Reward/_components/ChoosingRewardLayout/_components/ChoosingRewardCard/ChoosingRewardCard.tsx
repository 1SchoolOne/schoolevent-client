import { Button, Card } from 'antd'

import './ChoosingRewardCard-styles.less'

export function ChoosingRewardCard() {
	return (
		<Card
			className="reward-card--has-background"
			data-title={'Fnac'}
			cover={<img className="img-cover" alt="event-cover" src="../public/fnac.png" />}
		>
			<p className="required-points">
				Valeur:
				<span className="points"> 20</span> pts
			</p>
			<p className="rewards-number">
				Cartes cadeaux restantes: <span className="number">5</span>
			</p>
			<div className="select-reward">
				<Button type="primary">Sélectionner</Button>
			</div>
		</Card>
	)
}
