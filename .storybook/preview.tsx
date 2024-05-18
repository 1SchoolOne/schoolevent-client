import type { Preview } from '@storybook/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { StoriesProviders } from '../src/components'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
			<StoriesProviders>
				<div style={{ height: 750 }}>
					<Story />
				</div>
				<ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
			</StoriesProviders>
		),
	],
	tags: ['autodocs'],
}

export default preview
