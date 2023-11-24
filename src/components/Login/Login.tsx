import { Card, Segmented } from 'antd'
import { SegmentedValue } from 'antd/lib/segmented'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { LoginForm, MagicLinkForm } from './_components'

import './Login-styles.less'

export function Login() {
	const [searchParams, setSearchParams] = useSearchParams()

	const handleAuthTypeChange = (value: SegmentedValue) => {
		setSearchParams({ magiclink: value === 'magiclink' ? 'true' : 'false' })
	}

	useEffect(() => {
		if (!searchParams.get('magiclink')) {
			setSearchParams({ magiclink: 'false' })
		}
	}, [])

	return (
		<div className="login-container">
			<div className="login-container__hero">
				<img src="schoolevent_logo_white.svg" />
				<img src="schoolevent_text_white.svg" />
				<p>
					Le CRM <span>rapide</span> et <span>intuitif</span> dédié aux écoles.
				</p>
			</div>
			<div className="login-container__form">
				<Card title={<h2>Connexion</h2>}>
					<Segmented
						options={[
							{ label: 'Password', value: 'password' },
							{ label: 'Magic Link', value: 'magiclink' },
						]}
						onChange={handleAuthTypeChange}
						value={searchParams.get('magiclink') === 'true' ? 'magiclink' : 'password'}
						block
					/>
					{searchParams.get('magiclink') === 'true' ? <MagicLinkForm /> : <LoginForm />}
				</Card>
			</div>
		</div>
	)
}
