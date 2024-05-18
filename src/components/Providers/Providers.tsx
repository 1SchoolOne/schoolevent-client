import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AppProvider, ConfigProvider, theme as themeAlg } from 'antd'
import frFR from 'antd/lib/locale/fr_FR'

import { AuthProvider, ThemeProvider, useTheme } from '@contexts'
import { PropsWithChildren } from '@types'

import { appProviderProps } from './Providers-constants'

const APP_MODE = import.meta.env.MODE

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: APP_MODE === 'staging' ? 0 : 60_000,
		},
	},
})

function Providers({ children }: PropsWithChildren) {
	return (
		<ThemeProvider>
			<CommonProviders>{children}</CommonProviders>
		</ThemeProvider>
	)
}

export function ProvidersWithAuth({ children }: PropsWithChildren) {
	return (
		<Providers>
			<AuthProvider>{children}</AuthProvider>
		</Providers>
	)
}

export function StoriesProviders({ children }: PropsWithChildren) {
	return <Providers>{children}</Providers>
}

function CommonProviders({ children }: PropsWithChildren) {
	const { theme } = useTheme()

	return (
		<AppProvider {...appProviderProps}>
			<ConfigProvider
				theme={{
					cssVar: true,
					token: { colorPrimary: '#FE8E06' },
					algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
				}}
				locale={frFR}
			>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</ConfigProvider>
		</AppProvider>
	)
}
