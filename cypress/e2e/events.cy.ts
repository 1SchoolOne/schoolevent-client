import dayjs from 'dayjs'

import { EVENTS_URL, STUDENT_USER } from '../constants'
import {
	checkEventList,
	createEvent,
	deleteEvent,
	getButtonFromLabel,
	interceptEvent,
	interceptEventList,
	login,
	logout,
	waitForMainPageToLoad,
} from '../support/utils'

describe('Events', () => {
	context('as a manager', () => {
		const eventTitle = 'test-event_' + dayjs().unix()
		const eventDate = dayjs().add(7, 'day')

		beforeEach(() => {
			login({})

			waitForMainPageToLoad()
		})

		it('allows to see the list of events', () => {
			checkEventList()
		})

		it('allows to see details of an event', () => {
			interceptEventList()
			interceptEvent()

			cy.visit(EVENTS_URL)

			cy.get('.event-list__main-collapse').should('be.visible')

			cy.get('a').contains('Voir les détails').click()

			cy.contains('Mon événement').should('be.visible')
			cy.contains(/01 juillet 2024 à 10h00/i).should('be.visible')
			// TODO: should display school name on event details page
			// cy.contains('ESIEE-IT').should('be.visible')
			cy.contains('8 rue pierre de coubertin, 95300 Pontoise').should('be.visible')
			// TODO: should display event type on event details page
			// cy.contains(/conférence/i).should('be.visible')
			cy.contains(/super description/i).should('be.visible')
		})

		it('allows to create an event', () => {
			createEvent({
				event_title: eventTitle,
				event_date: eventDate.toISOString(),
				event_duration: 3600 * 2,
				event_type: 'presentation',
				event_address: '8 rue pierre de coubertin, pontoise',
				event_school_name: 'ESIEE-IT',
				event_description: `super description de l'événement ${eventTitle}`,
			})
		})

		it('allows to edit an event', () => {
			cy.visit(EVENTS_URL)

			cy.get(`[data-title=${eventTitle}]`).within(() => {
				cy.get('a').contains('Voir les détails').click()
			})

			getButtonFromLabel('Modifier').click()

			cy.get('[data-testid="event_description"]').within(() => {
				cy.get('textarea').clear()
				cy.get('textarea').type('Coding Factory')
			})

			getButtonFromLabel('Enregistrer').click()

			cy.get('.event-detail__body__description').should('contain', 'Coding Factory')
		})

		it('allows to delete an event', () => {
			deleteEvent(eventTitle)
		})

		it('displays edit/delete buttons only for author and assignee', () => {
			createEvent({
				event_title: eventTitle,
				event_date: eventDate.toISOString(),
				event_duration: 3600 * 2,
				event_type: 'presentation',
				event_address: '8 rue pierre de coubertin, pontoise',
				event_school_name: 'ESIEE-IT',
				event_description: `super description de l'événement ${eventTitle}`,
			})

			getButtonFromLabel('Modifier').should('be.visible')
			getButtonFromLabel('Supprimer').should('be.visible')

			logout()
			login({
				user: {
					email: 'ilhan.yapici@edu.esiee-it.fr',
					password: 'jesuisjesus',
				},
				shouldNavigate: false,
			})

			waitForMainPageToLoad()

			cy.visit(EVENTS_URL)

			cy.get(`[data-title=${eventTitle}]`).within(() => {
				cy.contains('Voir les détails').click()
			})

			getButtonFromLabel('Modifier').should('not.exist')
			getButtonFromLabel('Supprimer').should('not.exist')

			logout()
			login({ shouldNavigate: false })

			waitForMainPageToLoad()

			deleteEvent(eventTitle)
		})
	})

	context('as a student', () => {
		beforeEach(() => {
			login({ user: STUDENT_USER })

			waitForMainPageToLoad()
		})

		it('allows to see the list of events', () => {
			checkEventList()
		})

		it('allows to see details of an event', () => {
			interceptEventList()
			interceptEvent()

			cy.visit(EVENTS_URL)

			cy.get('.event-list__main-collapse').should('be.visible')

			cy.get('a').contains('Voir les détails').click()

			cy.contains('Mon événement').should('be.visible')
			cy.contains(/01 juillet 2024 à 10h00/i).should('be.visible')
			// TODO: should display school name on event details page
			// cy.contains('ESIEE-IT').should('be.visible')
			cy.contains('8 rue pierre de coubertin, 95300 Pontoise').should('be.visible')
			// TODO: should display event type on event details page
			// cy.contains(/conférence/i).should('be.visible')
			cy.contains(/super description/i).should('be.visible')
		})
	})
})
