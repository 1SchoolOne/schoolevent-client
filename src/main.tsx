import { App as AppProvider, ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AppProvider>
			<ConfigProvider theme={{ token: { colorPrimary: '#FE8E06' } }}>
				<App />
			</ConfigProvider>
		</AppProvider>
	</React.StrictMode>,
)
