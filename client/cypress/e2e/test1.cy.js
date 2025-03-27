const HOST = 'http://localhost:3000/'

describe('example to-do app', () => {
    beforeEach(() => {
      cy.visit(HOST)
    })
  
    it('Proper initial site loading: has header, sidebar, and map', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are two matched items,
      // which are the two default items.

      cy.get('header.header').should('have.length', 1)
      cy.get('div#map').should('have.length', 1)
      cy.get('section.sidebar').should('have.length', 1)
  
      // We can go even further and check that the default todos each contain
      // the correct text. We use the `first` and `last` functions
      // to get just the first and last matched elements individually,
      // and then perform an assertion with `should`.
    //   cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')
    //   cy.get('.todo-list li').last().should('have.text', 'Walk the dog')
    })
})
  