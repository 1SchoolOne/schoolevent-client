import { Segmented } from 'antd'
import { SegmentedValue } from 'antd/lib/segmented'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { LoginForm, MagicLinkForm } from './_components'

import './Login-styles.less'

export function Login() {
	const [searchParams, setSearchParams] = useSearchParams()

	const handleAuthTypeChange = (value: SegmentedValue) => {
		setSearchParams({ magiclink: value === 'magiclink' ? 'true' : 'false' })
	}

	const renderForm = useCallback(() => {
		if (searchParams.get('magiclink') === 'true') {
			return <MagicLinkForm />
		}

		return <LoginForm />
	}, [searchParams])

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
				<h1>Connexion</h1>
				<Segmented
					options={[
						{ label: 'Password', value: 'password' },
						{ label: 'Magic Link', value: 'magiclink' },
					]}
					onChange={handleAuthTypeChange}
					value={searchParams.get('magiclink') === 'true' ? 'magiclink' : 'password'}
				/>
				{renderForm()}
			</div>
		</div>
	)
}
