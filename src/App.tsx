import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Card, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import {
	AppointmentsLayout,
	AuthLayout,
	CalendarLayout,
	ContactsLayout,
	EventDetail,
	EventForm,
	EventList,
	EventUpdateForm,
	HomeLayout,
	LoginForm,
	MainLayout,
	ProtectedRoute,
	ProvidersWithAuth,
	Reward,
	SignUpForm,
	StudentEventDetail,
	StudentEventList,
	Success,
} from '@components'
import { FavoriteContactsProvider, MapDisplayProvider, useTheme } from '@contexts'

import './App.less'

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')
	const { theme } = useTheme()

	useEffect(() => {
		setFaviconHref(`/schoolevent_logo_${theme === 'dark' ? 'white' : 'black'}.svg`)
	}, [faviconHref, theme])

	return (
		<>
			<Helmet>
				<link rel="icon" href={faviconHref} />
			</Helmet>
			<BrowserRouter>
				<ProvidersWithAuth>
					<Routes>
						<Route path="*" element={<Navigate to="/" />} />
						<Route
							path="/"
							element={
								<FavoriteContactsProvider>
									<MainLayout />
								</FavoriteContactsProvider>
							}
						>
							<Route
								path="contacts"
								element={
									<ProtectedRoute>
										<Helmet>
											<title>SchoolEvent | Contacts</title>
										</Helmet>
										<MapDisplayProvider>
											<ContactsLayout />
										</MapDisplayProvider>
									</ProtectedRoute>
								}
							/>
							<Route index element={<HomeLayout />} />
							<Route
								path="calendar"
								element={
									<ProtectedRoute>
										<Helmet>
											<title>SchoolEvent | Calendier</title>
										</Helmet>
										<CalendarLayout />
									</ProtectedRoute>
								}
							/>
							<Route
								path="events"
								element={
									<ProtectedRoute>
										<Helmet>
											<title>SchoolEvent | Events</title>
										</Helmet>
										<Outlet />
									</ProtectedRoute>
								}
							>
								<Route index element={<EventList />} />
								<Route path="new" element={<EventForm />} />
								<Route path=":eventId" element={<EventDetail />} />
								<Route path="update/:eventId" element={<EventUpdateForm />} />
							</Route>
							<Route
								path="appointments"
								element={
									<ProtectedRoute>
										<Helmet>
											<title>SchoolEvent | Rendez-vous</title>
										</Helmet>
										<DndProvider backend={HTML5Backend}>
											<AppointmentsLayout />
										</DndProvider>
									</ProtectedRoute>
								}
							/>
						</Route>
						<Route
							path="studentEvents"
							element={
								<ProtectedRoute>
									<Helmet>
										<title>SchoolEvent | Events</title>
									</Helmet>
									<Outlet />
								</ProtectedRoute>
							}
						>
							<Route index element={<StudentEventList />} />
							<Route path=":studentEventId" element={<StudentEventDetail />} />
						</Route>
						<Route
							path="rewards"
							element={
								<ProtectedRoute>
									<Helmet>
										<title>SchoolEvent | Reward</title>
									</Helmet>
									<Reward />
								</ProtectedRoute>
							}
						></Route>
						<Route path="/auth" element={<AuthLayout />}>
							<Route path="*" element={<Navigate to="/auth/login" />} />
							<Route
								path="login"
								element={
									<Card title={<Typography.Title level={2}>Connexion</Typography.Title>}>
										<LoginForm />
									</Card>
								}
							/>
							<Route path="sign-up" element={<Outlet />}>
								<Route path="*" element={<Navigate to="/auth/sign-up" />} />
								<Route
									index
									element={
										<Card title={<Typography.Title level={2}>Inscription</Typography.Title>}>
											<SignUpForm />
										</Card>
									}
								/>
								<Route path="success" element={<Success />} />
							</Route>
						</Route>
					</Routes>
					<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
				</ProvidersWithAuth>
			</BrowserRouter>
		</>
	)
}

export default App
