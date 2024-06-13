import dayjs from 'dayjs'

import { TEvent } from '@types'

import { BASE_URL, EVENT, EVENTS_URL, EVENT_LIST, MANAGER_USER } from '../constants'
import { TCheckMessageParams } from '../types'

export function getInputFromLabel(label: string) {
	return cy.get(`label:contains("${label}")`).parent().parent().find('input')
}

export function getInputErrorFromLabel(label: string) {
	return cy.get(`label:contains("${label}")`).parent().parent().find('.ant-form-item-explain-error')
}

export function getButtonFromLabel(label: string) {
	return cy.get(`button:contains("${label}")`)
}

/**
 * Login with the given credentials or the default admin credentials.
 *
 * By default, navigate to the login page and login as a manager.
 */
export function login(params: {
	user?: { email: string; password: string }
	shouldNavigate?: boolean
}) {
	const { user = MANAGER_USER, shouldNavigate = true } = params

	if (shouldNavigate) {
		cy.visit(`${BASE_URL}/auth/login`)
	}

	getInputFromLabel('Email').type(user.email)
	getInputFromLabel('Mot de passe').type(user.password)

	getButtonFromLabel('Se connecter').click()
}

export function waitForMainPageToLoad() {
	cy.get('.main-layout').should('be.visible')
}

export function logout() {
	cy.get('.user-menu__dropdown').click()
	cy.contains('Déconnexion').click()
}

export function getTableColumnHeader(label: string | RegExp) {
	return cy.get('th').contains(label).parents('th')
}

/**
 * Should be used in combination with getTableColumnHeader.
 *
 * @example
 * ```ts
 * getTableColumnHeader(/$Établissement^/).within(() => {
 *  getTableColumnFilterButton().click()
 * })
 * ```
 */
export function getTableColumnFilterButton() {
	return cy.get('.ant-table-filter-trigger')
}

export function getFilterDropdown() {
	return cy.get('.ant-table-filter-dropdown')
}

export function getRadioFromLabel(label: string | RegExp) {
	return cy.get('.ant-radio-wrapper').contains(label).parents('label')
}

export function getFilterDropdownInput() {
	return getFilterDropdown().find('input')
}

export function checkTableRowsCount(count: number) {
	cy.get('.ant-table-tbody').find('tr.ant-table-row').should('have.length', count)
}

export function getAllTableRows() {
	return cy.get('.ant-table-tbody').find('tr.ant-table-row')
}

/**
 * To use when you need to wait for the table data to load.
 */
export function waitForTableDataToLoad(filtered = false) {
	cy.get('.se-table--loading').should('not.exist')

	if (filtered) {
		cy.get('.ant-pagination').within(() => {
			cy.get('li[title="536"]').should('not.exist')
		})
	}
}

export function getDropdownItem(label: string | RegExp) {
	return cy.get('li.ant-dropdown-menu-item').contains(label)
}

export function openMap() {
	cy.get('.open-map-btn').click()
}

export function closeMap() {
	cy.get('.close-map-btn').click()
}

export function toggleMapMode() {
	cy.get('.map-btn.toggle-mode-btn').click()
}

export function interceptEventList() {
	const url = new RegExp(String.raw`^${Cypress.env('API_BASE_URL')}\/events\?select=\*$`)

	cy.intercept('GET', url, {
		statusCode: 200,
		body: EVENT_LIST,
	})
}

export function interceptEvent() {
	const url = new RegExp(String.raw`^${Cypress.env('API_BASE_URL')}\/events\?select=\*\&id=eq.1$`)

	cy.intercept('GET', url, { statusCode: 200, body: EVENT })
}

export function createEvent(
	event: Omit<TEvent, 'id' | 'event_creator_id' | 'event_assignee' | 'event_background'>,
) {
	cy.visit(EVENTS_URL)

	getButtonFromLabel('Créer un événement').click()

	cy.get('[data-testid="event_title"]').within(() => {
		cy.get('div[role="button"]').click()
		cy.get('textarea').clear()
		cy.get('textarea').type(event.event_title)
	})

	cy.get('[data-testid="event_date"]').within(() => {
		cy.get('input').focus()
		cy.get('input').clear()
		cy.get('input').type(dayjs(event.event_date).format('DD/MM/YYYY à HH:mm') + '{enter}')
	})

	cy.get('[data-testid="event_duration"]').within(() => {
		cy.get('input').focus()
		cy.get('input').clear()
		cy.get('input').type(String(event.event_duration / 60 / 60))
	})

	cy.get('[data-testid="event_type"]').within(() => {
		cy.get('.ant-select').click()
	})

	let eventType = /portes ouvertes/i

	if (event.event_type === 'conference') {
		eventType = /conférence/i
	} else if (event.event_type === 'presentation') {
		eventType = /présentation/i
	}

	cy.get('.ant-select-item').contains(eventType).click()

	cy.get('[data-testid="event_assignee"]').within(() => {
		cy.get('.ant-select').click()
	})

	cy.get('.ant-select-item').contains('Manager').click()

	cy.get('[data-testid="event_address"]').within(() => {
		cy.get('input').type(event.event_address)
	})

	cy.get('[data-testid="event_school_name"]').within(() => {
		cy.get('input').type(event.event_school_name)
	})

	cy.get('[data-testid="event_description"]').within(() => {
		cy.get('textarea').type(
			event.event_description ??
				`Description:
Super nice description of event "${event.event_title}" that describes absolutely nothing.`,
		)
	})

	getButtonFromLabel("Créer l'événement").click()
}

export function deleteEvent(eventTitle: string) {
	cy.visit(EVENTS_URL)

	cy.get(`[data-title=${eventTitle}]`).within(() => {
		cy.get('a').contains('Voir les détails').click()
	})

	getButtonFromLabel('Supprimer').click()

	cy.contains("Supprimer l'événement")
		.closest('.ant-modal')
		.within(() => {
			getButtonFromLabel('Supprimer').click()
		})

	checkSuccessMessage({ message: 'Événement supprimé avec succès.' })
	checkErrorMessage({ shouldExist: false })

	cy.get(`[data-title=${eventTitle}]`).should('not.exist')
}

export function checkSuccessMessage(params: TCheckMessageParams) {
	const { message, shouldBeVisible, shouldExist } = params

	if (shouldExist !== undefined) {
		cy.get('.ant-message-notice-success').should(!shouldExist ? 'not.exist' : 'exist')
	} else if (shouldBeVisible !== undefined) {
		cy.get('.ant-message-notice-success').should(!shouldBeVisible ? 'not.be.visible' : 'be.visible')
	} else {
		cy.get('.ant-message-notice-success').should('be.visible')
	}

	if (message) {
		cy.get('.ant-message-notice-success').should('contain', message)
	}
}

export function checkErrorMessage(params: TCheckMessageParams) {
	const { message, shouldBeVisible, shouldExist } = params

	if (shouldExist !== undefined) {
		cy.get('.ant-message-notice-error').should(!shouldExist ? 'not.exist' : 'exist')
	} else if (shouldBeVisible !== undefined) {
		cy.get('.ant-message-notice-error').should(!shouldBeVisible ? 'not.be.visible' : 'be.visible')
	} else {
		cy.get('.ant-message-notice-error').should('be.visible')
	}

	if (message) {
		cy.get('.ant-message-notice-error').should('contain', message)
	}
}

export function checkEventList() {
	interceptEventList()

	cy.visit(EVENTS_URL)

	cy.contains('Mon événement').should('be.visible')
	cy.contains(/lundi 1 juillet/i).should('be.visible')
	cy.contains('ESIEE-IT').should('be.visible')
	cy.contains('8 rue pierre de coubertin, 95300 Pontoise').should('be.visible')
	cy.contains(/conférence/i).should('be.visible')
	cy.contains(/durée : 1h/i).should('be.visible')
}
