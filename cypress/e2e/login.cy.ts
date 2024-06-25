import {
	ADMIN_USER,
	APPOINTMENTS_URL,
	BASE_URL,
	CALENDAR_URL,
	CONTACTS_URL,
	DISABLED_USER,
	EVENTS_URL,
	LOGIN_URL,
	MANAGER_USER,
	REWARDS_URL,
	SIDE_MENU_LABELS,
	STUDENT_USER,
} from '../constants'
import {
	getButtonFromLabel,
	getInputFromLabel,
	login,
	logout,
	waitForMainPageToLoad,
} from '../support/utils'

describe('Login', () => {
	it('allows to login with school email', () => {
		login({ user: MANAGER_USER })
		waitForMainPageToLoad()

		cy.url().should('eq', `${BASE_URL}/`)
	})

	it('displays invalid credentials error', () => {
		cy.visit(LOGIN_URL)

		getInputFromLabel('Email').type('dummy@email.com')
		getInputFromLabel('Mot de passe').type('dummypassword')

		getButtonFromLabel('Se connecter').click()

		cy.contains('Email ou mot de passe invalide.').should('be.visible')
	})

	it('do not allow access to unapproved users', () => {
		login({ user: DISABLED_USER })

		cy.contains('Accès refusé').should('be.visible')
		cy.contains("Votre compte n'est pas approuvé. Veuillez contacter votre administrateur.").should(
			'be.visible',
		)
	})

	it('displays side menu items based on user role', () => {
		// As admin
		login({ user: ADMIN_USER })

		waitForMainPageToLoad()

		cy.get('.main-layout__sider').within(() => {
			SIDE_MENU_LABELS.admin.shouldHaveAccessTo.forEach((label) => {
				cy.contains(label).should('exist').and('be.visible')
			})
		})

		logout()

		// As manager
		login({ user: MANAGER_USER })

		waitForMainPageToLoad()

		cy.get('.main-layout__sider').within(() => {
			SIDE_MENU_LABELS.manager.shouldHaveAccessTo.forEach((label) => {
				cy.contains(label).should('exist').and('be.visible')
			})

			// SIDE_MENU_LABELS.manager.shouldNotHaveAccessTo.forEach((label) => {
			// 	cy.contains(label).should('not.exist')
			// })
		})

		logout()

		// As student
		login({ user: STUDENT_USER, shouldNavigate: false })

		cy.get('.main-layout__sider').within(() => {
			SIDE_MENU_LABELS.student.shouldHaveAccessTo.forEach((label) => {
				cy.contains(label).should('exist').and('be.visible')
			})

			SIDE_MENU_LABELS.student.shouldNotHaveAccessTo.forEach((label) => {
				cy.contains(label).should('not.exist')
			})
		})
	})

	it('allows access to all routes except administration as a manager', () => {
		login({ user: MANAGER_USER })

		waitForMainPageToLoad()

		// Manager should have access to contacts page
		cy.visit(CONTACTS_URL)
		cy.get('.contacts-table').should('exist').and('be.visible')

		// Manager should have access to calendar page
		cy.visit(CALENDAR_URL)
		cy.get('.events-calendar').should('exist').and('be.visible')

		// Manager should have access to appointments page
		cy.visit(APPOINTMENTS_URL)
		cy.get('.appointments-layout').should('exist').and('be.visible')

		// Manager should have access to events page
		cy.visit(EVENTS_URL)
		cy.get('.event-layout').should('exist').and('be.visible')

		// Manager should have access to rewards page
		cy.visit(REWARDS_URL)
		cy.contains('Historique de tes évènements').should('exist').and('be.visible')
	})

	it('allows access to events and rewards routes as a student', () => {
		login({ user: STUDENT_USER })

		waitForMainPageToLoad()

		// Student should not have access to contacts page
		cy.visit(CONTACTS_URL)
		cy.url().should('eq', EVENTS_URL)

		// Student should not have access to calendar page
		cy.visit(CALENDAR_URL)
		cy.url().should('eq', EVENTS_URL)

		// Student should not have access to appointments page
		cy.visit(APPOINTMENTS_URL)
		cy.url().should('eq', EVENTS_URL)

		// Student should have access to events page
		cy.visit(EVENTS_URL)
		cy.get('.event-layout').should('exist').and('be.visible')

		// Student should have access to rewards page
		cy.visit(REWARDS_URL)
		cy.contains('Historique de tes évènements').should('exist').and('be.visible')
	})
})
