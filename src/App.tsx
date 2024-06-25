import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Card, Typography } from 'antd'
import { Suspense, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'

import {
	AddReward,
	AppointmentsLayout,
	AuthLayout,
	CalendarLayout,
	ChoosingRewardLayout,
	ContactsLayout,
	EventDetail,
	EventForm,
	EventList,
	HomeLayout,
	LoginForm,
	MainLayout,
	Onboarding,
	ProtectedRoute,
	ProvidersWithAuth,
	Reward,
	SignUpForm,
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
									<ProtectedRoute>
										<MainLayout />
										<Onboarding />
									</ProtectedRoute>
								</FavoriteContactsProvider>
							}
						>
							<Route
								path="contacts"
								element={
									<>
										<Helmet>
											<title>SchoolEvent | Contacts</title>
										</Helmet>
										<MapDisplayProvider>
											<ContactsLayout />
										</MapDisplayProvider>
									</>
								}
							/>
							<Route index element={<HomeLayout />} />
							<Route
								path="calendar"
								element={
									<>
										<Helmet>
											<title>SchoolEvent | Calendrier</title>
										</Helmet>
										<CalendarLayout />
									</>
								}
							/>
							<Route
								path="events"
								element={
									<>
										<Helmet>
											<title>SchoolEvent | Évènements</title>
										</Helmet>
										<Outlet />
									</>
								}
							>
								<Route index element={<EventList />} />
								<Route path="new" element={<EventForm />} />
								<Route
									path="view/:eventId"
									element={
										<Suspense>
											<EventDetail />
										</Suspense>
									}
								/>
								<Route path="edit/:eventId" element={<EventForm />} />
							</Route>
							<Route
								path="appointments"
								element={
									<>
										<Helmet>
											<title>SchoolEvent | Rendez-vous</title>
										</Helmet>
										<DndProvider backend={HTML5Backend}>
											<AppointmentsLayout />
										</DndProvider>
									</>
								}
							/>
							<Route
								path="rewards"
								element={
									<>
										<Helmet>
											<title>SchoolEvent | Reward</title>
										</Helmet>
										<Outlet />
									</>
								}
							>
								<Route index element={<Reward />} />
								<Route path="add" element={<AddReward />} />
								<Route path="chooseReward" element={<ChoosingRewardLayout />} />
							</Route>
						</Route>
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
