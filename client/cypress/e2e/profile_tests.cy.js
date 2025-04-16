const HOST = 'http://localhost:3000'

Cypress.Commands.add('login', (username, password) => {
	cy.visit(`${HOST}/auth/login`);
	cy.get('#email').type(username);
	cy.get('#password').type(password);
	cy.get('[type=submit]').click();
});

Cypress.Commands.add('goToProfile', () => {
	cy.get('[href="/profile"]').last().click();
});

describe('Profile editing tests', () => {
	beforeEach(() => {
		cy.login('user@user.com', 'user');
		cy.goToProfile();
	});

	it('User can edit a field', () => {
		cy.get('#firstName').type('{backspace}{enter}');
		cy.get('.profile-popup-btns')
			.children()
			.last()
			.click();
		cy.wait(501);

		cy.get('#firstName')
			.should('have.value', 'Mis');

		// restore name
		cy.get('#firstName')
			.type('{backspace}{backspace}{backspace}Miss{enter}')

		cy.get('.profile-popup-btns')
			.children()
			.last()
			.click();
	});

	it('User can edit multiple fields', () => {
		cy.get('#firstName').type('{backspace}'); // change to 'Mis'
		cy.get('#driversLicenseState')
			.select('NY');
		cy.get('#addr1').type('{backspace}{backspace}{backspace}{enter}') // change to '14 Main'

		cy.get('.profile-popup-btns')
			.children()
			.last()
			.click();
		cy.wait(501);

		cy.get('#firstName')
			.should('have.value', 'Mis');
		cy.get('#addr1')
			.should('have.value', '14 Main');
		cy.get('#driversLicenseState')
			.should('have.value', 'NY')

		// restore fields
		cy.get('#firstName')
			.type('{backspace}{backspace}{backspace}Miss');
		cy.get('#driversLicenseState')
			.select('AZ');
		cy.get('#addr1').type(' Rd{enter}');

		cy.get('.profile-popup-btns')
			.children()
			.last()
			.click();
	});

	it('User can reset multiple fields', () => {
		cy.get('#firstName').type('{backspace}'); // change to 'Mis'
		cy.get('#driversLicenseState')
			.select('NY');
		cy.get('#addr1').type('{backspace}{backspace}{backspace}') // change to '14 Main'

		cy.get('.reset-icon')
			.click();
		cy.wait(501);

		cy.get('#firstName')
			.should('have.value', 'Miss');
		cy.get('#addr1')
			.should('have.value', '14 Main Rd');
		cy.get('#driversLicenseState')
			.should('have.value', 'AZ')
	});
});
// describe('Profile vehicle tests',);
// describe('Profile editing persistence tests');