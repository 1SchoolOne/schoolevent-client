import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import { IErrorBoundaryHandlerProps } from './ErrorBoundaryHandler-types'

import './ErrorBoundaryHandler-styles.less'

const DEV_MODE = import.meta.env.DEV

// TODO: hide map toggle button if there is an error
export function ErrorBoundaryHandler(props: IErrorBoundaryHandlerProps) {
	const { error, resetErrorBoundary } = props

	const navigate = useNavigate()

	const getErrorMessage = () => {
		// ODSQL error
		if (error?.error_code) {
			return "Un problème est survenu lors de la récupération des données de l'Éducation Nationale."
		}

		return 'Nous avons rencontré un soucis lors de la récupération de données.'
	}

	return (
		<Result
			className="se-error-boundary-handler"
			status="error"
			title="Oups..."
			subTitle={getErrorMessage()}
			extra={[
				<Button
					key="reset-error-boundary"
					type="primary"
					onClick={() => resetErrorBoundary()}
					danger
				>
					Réessayer
				</Button>,
				<Button key="return-to-home-page" onClick={() => navigate('/')}>
					Retour à la page d'accueil
				</Button>,
			]}
		>
			{DEV_MODE && <pre>{JSON.stringify(error, null, 2)}</pre>}
		</Result>
	)
}
