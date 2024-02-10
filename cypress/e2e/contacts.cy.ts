import { CONTACTS_URL } from '../constants'
import {
	checkTableRowsCount,
	getAllTableRows,
	getButtonFromLabel,
	getFilterDropdown,
	getFilterDropdownInput,
	getRadioFromLabel,
	getTableColumnFilterButton,
	getTableColumnHeader,
	login,
} from '../support/utils'

describe('Contacts', () => {
	it('allows to filter schools by name', () => {
		login()

		cy.visit(CONTACTS_URL)

		getTableColumnHeader(/^Établissement$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdownInput().type(
			'Académie Internationale des Métiers du Golf, Ecole technologique privée{enter}',
		)

		// This assertion is necessary to ensure that the data has been loaded.
		cy.get('.ant-spin-blur').should('not.exist')
		// This assertion is necessary to ensure that the filter was applied.
		cy.get('.ant-pagination-item').last().find('a').invoke('text').should('eq', '1')

		checkTableRowsCount(1)
	})

	it('allows to filter schools by type', () => {
		login()

		cy.visit(CONTACTS_URL)

		getTableColumnHeader(/^Type d'établissement$/).within(() => {
			getTableColumnFilterButton().click()
		})

		getFilterDropdown().within(() => {
			getRadioFromLabel(/^Collège$/).click()
			getButtonFromLabel('OK').click()
		})

		// This assertion is necessary to ensure that the data has been loaded.
		cy.get('.ant-spin-blur').should('not.exist')
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
				cy.wrap(row).find('td').eq(2).should('contain.text', 'Collège')
			})
		})
	})
})
