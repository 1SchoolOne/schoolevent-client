import { create } from '@storybook/theming/create'

export default create({
	base: 'light',
	brandTitle: 'SchoolEvent',
	brandUrl: 'https://github.com/SchoolEvent/schoolevent-client',
	brandImage:
		'https://raw.githubusercontent.com/SchoolEvent/schoolevent-client/2b1ee75936f2c0ced679df507fe45a3e576bf1ce/public/schoolevent_text_black.svg',
	brandTarget: '_self',

	//
	colorPrimary: '#FE8E06',
	colorSecondary: '#FE8E06',

	// UI
	appBg: '#ffffff',
	appContentBg: '#ffffff',
	appPreviewBg: '#ffffff',
	appBorderRadius: 4,

	// Text colors
	textColor: '#10162F',
	textInverseColor: '#ffffff',

	// Toolbar default and active colors
	barTextColor: '#9E9E9E',
	barSelectedColor: '#FE8E06',
	barHoverColor: '#FE8E06',
	barBg: '#ffffff',
})
