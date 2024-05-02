import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {
	App as AppProvider,
	Button,
	Card,
	ConfigProvider,
	Typography,
	theme as themeAlg,
} from 'antd'
import frFR from 'antd/lib/locale/fr_FR'
import logger from 'loglevel'
import prefixLogger from 'loglevel-plugin-prefix'
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
	SignUpForm,
	Success,
	useGetColumnSearchFilterConfig,
} from '@components'
import { AuthProvider, FavoriteContactsProvider, MapDisplayProvider, useTheme } from '@contexts'
import { Database } from '@types'
import { useSupabase } from '@utils'

import { Table } from './components/Table/Table'
import { parseFiltersForSupabase } from './components/Table/Table-utils'

import './App.less'

const APP_MODE = import.meta.env.MODE

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: APP_MODE === 'staging' ? 0 : 60_000,
		},
	},
})

prefixLogger.reg(logger)
logger.enableAll()
prefixLogger.apply(logger, {
	format(level, _name, timestamp) {
		return `[${timestamp}] ${level}:`
	},
})

function App() {
	const [faviconHref, setFaviconHref] = useState<string>('')
	const { theme } = useTheme()
	const supabase = useSupabase()

	useEffect(() => {
		setFaviconHref(`/schoolevent_logo_${theme === 'dark' ? 'white' : 'black'}.svg`)
	}, [faviconHref, theme])

	return (
		<AppProvider
			notification={{ placement: 'bottomRight', maxCount: 3, stack: { threshold: 2 } }}
			message={{ maxCount: 3, duration: 5 }}
		>
			<ConfigProvider
				theme={{
					cssVar: true,
					token: { colorPrimary: '#FE8E06' },
					algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
				}}
				locale={frFR}
			>
				<Helmet>
					<link rel="icon" href={faviconHref} />
				</Helmet>
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
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
									<Route
										path="toto"
										element={
											<>
												<Button
													onClick={() => {
														queryClient.refetchQueries({ queryKey: ['test-table'] })
													}}
												>
													Refresh
												</Button>
												<Table<Database['public']['Tables']['favorites']['Row']>
													tableId="test-table"
													// TODO: create a function to parse filters and sorter parameters
													dataSource={async (filters, sorter) => {
														const parsedFilters = parseFiltersForSupabase(filters)
														let response = supabase.from('favorites').select()

														if (parsedFilters) {
															response = response.or(parsedFilters)
														}

														if (sorter) {
															response = response.order(sorter.field, {
																ascending: sorter.order === 'ascend',
															})
														}

														const { data, error } = await response

														if (error) {
															throw error
														}

														return data
													}}
													columns={[
														{
															dataIndex: 'school_name',
															title: 'École',
															width: 200,
															...useGetColumnSearchFilterConfig(),
															sorter: true,
														},
														{
															dataIndex: 'school_city',
															title: 'Ville',
															width: 200,
															sorter: true,
															...useGetColumnSearchFilterConfig(),
														},
														{
															dataIndex: 'school_postal_code',
															title: 'Code postal',
															...useGetColumnSearchFilterConfig(),
														},
													]}
												/>
											</>
										}
									/>
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
						</AuthProvider>
						<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
					</QueryClientProvider>
				</BrowserRouter>
			</ConfigProvider>
		</AppProvider>
	)
}

export default App
