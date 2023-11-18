import { LoginForm } from './_components/LoginForm/LoginForm'

import './Login-styles.less'

export function Login() {
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
				<LoginForm />
			</div>
		</div>
	)
}
