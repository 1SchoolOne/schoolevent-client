import { expect, test } from 'vitest'

import { isStringEmpty } from '../isStringEmpty'

test('should return true if the string is empty', () => {
	expect(isStringEmpty('')).toBe(true)
})

test('should return true if the string is only whitespace', () => {
	expect(isStringEmpty('   ')).toBe(true)
})

test('should return true if the input is undefined', () => {
	expect(isStringEmpty(undefined)).toBe(true)
})

test('should return false if the string is not empty', () => {
	expect(isStringEmpty('hello')).toBe(false)
})

test('should return false if the input is a number', () => {
	expect(isStringEmpty(123)).toBe(false)
})

test('should return false if the input is an object', () => {
	expect(isStringEmpty({})).toBe(false)
})
