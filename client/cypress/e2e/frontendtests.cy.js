const HOST = 'http://localhost:3000/home'

// describe('Registering and login', () => {
//     beforeEach(() => {
//         cy.visit(`${HOST}/auth/`);
//     });

//     it('Fail to login to nonregistered account', () => {
//         cy.get('#email')
//             .should('exist')
//             .type("invalid_account@gmail.com");
        
//         cy.get('#password')
//             .should('exist')
//             .type("fakepassword");

//         cy.get('button.auth-button')
//             .first()
//             .should('exist')
//             .click();
        
//         //check if error message exists for failed login
//         cy.contains('Invalid').should('exist')
//     });

//     it('Register a user', () => {
//         cy.get('a.auth-link').should('exist').click();
//         cy.get('#first_name').type("Testname");
//         cy.get('#last_name').type("McLastname");
//         cy.get('#email').type("test@gmail.com");
//         cy.get('#password').type("testpassword");
//         cy.get()

//     });

//     it('Login as registered a user', () => {
//         cy.get('#email').should('exist');
//         cy.get('#email')
//             .type("test@gmail.com");
        
//         cy.get('#password').should('exist');
//         cy.get('#password')
//             .type("testpassword");

//     });
// })

describe('Basic home page tests', () => {
    beforeEach(() => {
      cy.visit(`${HOST}`);
    });
  
    it('Proper initial site loading: has header, sidebar, and map', () => {
      // We use the `cy.get()` command to get all elements that match the selector.
      // Then, we use `should` to assert that there are two matched items,
      // which are the two default items.

      cy.get('header.header').should('have.length', 1);
      cy.get('div#map').should('have.length', 1);
      cy.get('section.sidebar').should('have.length', 1);
    });

    it('Rate Type/Search Type check', () =>{
        cy.get('#rate-selection')
            .find('.type-hover')
            .should('have.length', 5)
            .each((elem, index) =>{
                cy.wrap(elem)
                    .click()
                    .should('have.class', 'selected')
            });

        cy.get('#building-lot-selection')
            .find('.type-hover')
            .should('have.length', 2)
            .each((elem, index) => {
                cy.wrap(elem)
                    .click()
                    .should('have.class', 'selected')
            });
        
        
        // reselect defaults
        cy.get('#rate-selection')
            .find('.type-hover')
            .first()
            .click();
        cy.get('#building-lot-selection')
            .find('.type-hover')
            .first()
            .click();
    });

    it("Popup tests", () => {
        cy.get('.popup').should('not.exist');
        cy.get('.filter-btn').click();
        cy.get('.popup').should('exist');
        cy.get('.popup-header')
            .find('.close-button')
            .click();
        cy.get('.popup').should('not.exist');
    });
});
  
describe('Search tests', () => {
    beforeEach(() => {
        cy.visit(HOST);
        cy.get('input.autocomplete-input').should('exist');
    });

    it('Inital results', () => {
        // number from our postgres db
        const NUM_PARKING = 66;
        cy.get('.lot-results')
            .children()
            .should('have.length', NUM_PARKING);
    });

    it('Search for lot1', () => {
        // search for lots
        cy.get('#building-lot-selection')
            .find('.type-hover')
            .last()
            .click();
        
        // search for lot 1
        cy.get('input.autocomplete-input')
            .type("Lot 1{downarrow}{enter}");
        
        // ensure we are on lot 1's page
        cy.contains('.selected-lot-name', 'Lot 1').should('exist');
    });
    it('Search for lot40', () => {
        // search for lots
        cy.get('#building-lot-selection')
            .find('.type-hover')
            .last()
            .click();
        
        // search for lot 1
        cy.get('input.autocomplete-input')
            .type("Lot 40{downarrow}{enter}");
        
        // ensure we are on lot 1's page
        cy.contains('.selected-lot-name', 'Lot 40').should('exist');
    });
    it('Autocomplete for buildings', () => {
        // search for new computer
        cy.get('input.autocomplete-input')
            .type("New Computer");
        cy.contains("Computer Science, New").should('exist');

        // search for sac
        cy.get('input.autocomplete-input')
            .clear()
            .type("SAC");
        cy.contains("Student Activities Center").should('exist');

        // search for colleges
        cy.get('input.autocomplete-input')
            .clear()
            .type("College");
        cy.get('[role=option]:contains("College")')
            .should('have.length.gt', 4);

        cy.get('input.autocomplete-input')
            .clear()
            .type("ZZZZZZZZZZZZ");
        cy.contains('No results found').should('exist');
    });
    it('Lot results with distances show up on building search', () => {
        // results with distances show up on search
        cy.get('input.autocomplete-input')
            .type("A{downarrow}{enter}");

        cy.get('.result-dist-row')
            .filter((_, elem) => /\d\.\d* mi/.test(elem.textContent))
            .should('have.length.gt', 1);
    });
});