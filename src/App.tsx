import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import { loginRoute } from '@routes'

import './App.css'

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')

	useEffect(() => {
		const matcher = window.matchMedia('(prefers-color-scheme: dark)')

		setFaviconHref(`schoolevent_logo_${matcher.matches ? 'white' : 'black'}.svg`)

		matcher.onchange = () =>
			setFaviconHref(`schoolevent_logo_${matcher.matches ? 'white' : 'black'}.svg`)
	}, [faviconHref])

	const router = createBrowserRouter([loginRoute])

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
