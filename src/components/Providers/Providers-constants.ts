import { AppProps } from 'antd'

export const appProviderProps: AppProps = {
	notification: { placement: 'bottomRight', maxCount: 3, stack: { threshold: 2 } },
	message: { maxCount: 3, duration: 5 },
}
