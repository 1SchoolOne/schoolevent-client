import { expect } from 'chai'

import { getFileExtension } from '../EventForm-utils'

describe('getFileExtension', () => {
	test('should return the file extension', () => {
		expect(getFileExtension('image.jpg')).to.equal('jpg')
		expect(getFileExtension('image.png')).to.equal('png')
	})
})
