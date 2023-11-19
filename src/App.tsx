import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { MainLayout } from '@components'
import { AuthProvider } from '@contexts'
import { loginRoute, noMatchRoute } from '@routes'

import './App.less'

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')

	useEffect(() => {
		const matcher = window.matchMedia('(prefers-color-scheme: dark)')

		setFaviconHref(`schoolevent_logo_${matcher.matches ? 'white' : 'black'}.svg`)

		matcher.onchange = () =>
			setFaviconHref(`schoolevent_logo_${matcher.matches ? 'white' : 'black'}.svg`)
	}, [faviconHref])

	const router = createBrowserRouter([
		loginRoute,
		noMatchRoute,
		{
			path: '/',
			element: (
				<AuthProvider>
					<MainLayout />
				</AuthProvider>
			),
		},
	])

	return (
		<>
			<Helmet>
				<link rel="icon" href={faviconHref} />
			</Helmet>
			<RouterProvider router={router} />
		</>
	)
}

export default App
