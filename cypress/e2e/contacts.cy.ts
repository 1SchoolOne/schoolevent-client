import { CONTACTS_URL } from '../constants'
import {
	checkTableRowsCount,
	closeMap,
	getAllTableRows,
	getButtonFromLabel,
	getDropdownItem,
	getFilterDropdown,
	getFilterDropdownInput,
	getRadioFromLabel,
	getTableColumnFilterButton,
	getTableColumnHeader,
	login,
	openMap,
	toggleMapMode,
	waitForMainPageToLoad,
	waitForTableDataToLoad,
} from '../support/utils'

describe('Contacts', () => {
	beforeEach(() => {
		login(undefined, true)

		waitForMainPageToLoad()

		cy.visit(CONTACTS_URL, {
			onBeforeLoad({ navigator }) {
				// ESIEE-IT location
				const latitude = 49.04424
				const longitude = 2.082599
				cy.stub(navigator.geolocation, 'getCurrentPosition').callsArgWith(0, {
					coords: { latitude, longitude },
				})
			},
		})

		// Switch to government tab
		cy.contains('Gouvernement').click()

		waitForTableDataToLoad()
	})

	it('allows to filter schools by name', () => {
		getTableColumnHeader(/^Établissement$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdownInput().type(
			'Académie Internationale des Métiers du Golf, Ecole technologique privée{enter}',
		)

		waitForTableDataToLoad(true)

		// This assertion is necessary to ensure that the filter was applied.
		cy.get('.ant-pagination-item').last().find('a').invoke('text').should('eq', '1')

		checkTableRowsCount(1)
	})

	it('allows to filter schools by type', () => {
		getTableColumnHeader(/^Type$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdown().within(() => {
			getRadioFromLabel(/^Collège$/).click()
			getButtonFromLabel('OK').click()
		})

		waitForTableDataToLoad(true)

		// This assertion is necessary to ensure that the filter was applied.
		cy.get('.ant-pagination-item')
			.last()
			.find('a')
			.invoke('text')
			.then((text) => {
				const lastPage = parseInt(text, 10)
				expect(lastPage).to.be.lessThan(536)
			})

		getAllTableRows().then((rows) => {
			expect(rows.length).to.equal(25)

			cy.wrap(rows).each((row) => {
				// Column 'Type' should equal to 'Collège'
				cy.wrap(row).find('td').eq(2).should('contain.text', 'Collège')
			})
		})
	})

	it('allows to filter by city', () => {
		getTableColumnHeader(/^Commune$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdown().within(() => {
			cy.get('input').type('Cergy{enter}')
		})

		waitForTableDataToLoad(true)

		getAllTableRows().then((rows) => {
			cy.wrap(rows).each((row) => {
				// Column 'Commune' should equal to 'Cergy'
				cy.wrap(row).find('td').eq(3).should('contain.text', 'Cergy')
			})
		})
	})

	it('allows to filter by postcode', () => {
		// On some screen size, the "Code postal" column might not be in view
		cy.get('.ant-table-body').scrollTo(100, 0)

		getTableColumnHeader(/^Code postal$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdown().within(() => {
			cy.get('input').type('95310{enter}')
		})

		waitForTableDataToLoad(true)

		getAllTableRows().then((rows) => {
			cy.wrap(rows).each((row) => {
				// Column 'Code postal' should equal to '95310'
				cy.wrap(row).find('td').eq(4).should('contain.text', '95310')
			})
		})
	})

	it('allows to filter by address', () => {
		// On some screen size, the "Adresse" column might not be in view
		cy.get('.ant-table-body').scrollTo(300, 0)

		getTableColumnHeader(/^Adresse$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdown().within(() => {
			cy.get('input').type('2 rue des Egalisses{enter}')
		})

		waitForTableDataToLoad(true)

		getAllTableRows().then((rows) => {
			cy.wrap(rows).each((row) => {
				// Column 'Adresse' should equal to '2 rue des Egalisses'
				cy.wrap(row).find('td').eq(5).should('contain.text', '2 rue des Egalisses')
			})
		})
	})

	it('allows to filter globally', () => {
		cy.get('.se-table-global-search')
			.find('input')
			.type("Section d'enseignement professionnel du lycée polyvalent Jean Perrin")

		waitForTableDataToLoad(true)

		getAllTableRows().then((rows) => {
			cy.wrap(rows).each((row) => {
				cy.wrap(row).contains('Jean Perrin').should('be.visible')
			})
		})
	})

	it('allows to expand rows to see the email and phone number', () => {
		getTableColumnHeader(/^Établissement$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdownInput().type(
			'Académie Internationale des Métiers du Golf, Ecole technologique privée{enter}',
		)

		waitForTableDataToLoad(true)

		cy.get('.ant-table-row-expand-icon').click()

		cy.get('table').contains('Email').should('be.visible')
		cy.get('table').contains('Téléphone').should('be.visible')

		checkTableRowsCount(1)
	})

	it('allows to add and delete a school from favorite list', () => {
		getAllTableRows().then((rows) => {
			cy.wrap(rows.first()).within(() => {
				// Click on favorite button
				cy.get('.favorite-button').click()
			})
		})

		waitForTableDataToLoad()

		// Check that the favorite have been added to the favorite list
		cy.get('.favorites-list').find('ul.ant-list-items').should('have.length', 1)

		// Then removes all favorites
		cy.get('ul.ant-list-items')
			.find('.ant-list-item')
			.then((favs) => {
				// Iterate over each favorite
				cy.wrap(favs).each((fav) => {
					cy.wrap(fav).within(() => {
						cy.get('button').click()
					})

					getDropdownItem('Supprimer des favoris').click()
				})
			})
	})

	it('displays the user pin on the map', () => {
		openMap()

		cy.get('img[alt="user-pin"]').should('be.visible')
	})

	it('navigates to pin when clicking on a school in the table', () => {
		const schoolName = "2CG Ecole d'Esthétique et de Coiffure"

		openMap()

		cy.get('.se-table-global-search')
			.find('input')
			.type(schoolName + '{enter}')

		waitForTableDataToLoad(true)

		cy.get('.ant-table-row').contains(schoolName).click()

		cy.get(`img[title="${schoolName}"]`).should('be.visible')
	})

	it('toggles map display modes', () => {
		// By default, the map is closed. Therefore, it should not be visible.
		cy.get('.map-container').should('not.be.visible')
		cy.get('.table-container').should('be.visible')

		// When the user opens the map for the first time, it opens in split mode.
		// Both the table and the map should be visible.
		openMap()
		cy.get('.map-container').should('be.visible')
		cy.get('.table-container').should('be.visible')

		// When toggling the full width map, only the map should be visible.
		toggleMapMode()
		cy.get('.map-container').should('be.visible')
		cy.get('.table-container').should('not.be.visible')

		// When closing the map, only the table should be visible.
		closeMap()
		cy.get('.map-container').should('not.be.visible')
		cy.get('.table-container').should('be.visible')

		// When the map opens back, it should retrieve its previous state.
		openMap()
		cy.get('.map-container').should('be.visible')
		cy.get('.table-container').should('not.be.visible')
	})

	// (maybe?) TODO test range filter
})
