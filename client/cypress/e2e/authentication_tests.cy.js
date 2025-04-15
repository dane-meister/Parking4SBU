const HOST_LOGIN = 'http://localhost:3000/auth/login'

describe('Login tests', () => {
    beforeEach(() => {
        cy.visit(`${HOST_LOGIN}`);
    });

    it('User can log in', () => {
        cy.get('#email').type('user@user.com');
        cy.get('#password').type('user'); // secret password
        cy.get('[type=submit]').click();

        // only exists on successful sign up
        cy.get('.profile-icon')
            .should('exist')
            .filter(':visible')
            .click();
        
        cy.contains('Miss User'); // from profile page

        cy.get('#sign-out').click();
        cy.contains('Welcome Back');
    });

    it('Faculty can sign in', () => {
        cy.get('#email').type('faculty@faculty.com');
        cy.get('#password').type('faculty'); // secret password
        cy.get('[type=submit]').click();

        // only exists on successful sign up
        cy.get('.profile-icon')
            .should('exist')
            .filter(':visible')
            .click();
        
        cy.contains('Mrs Faculty'); // from profile page

        cy.get('#sign-out').click();
        cy.contains('Welcome Back');
    });

    it('New user not approved yet can\'t sign in', () => {
        cy.get('#email').type('new@new.com');
        cy.get('#password').type('new'); // secret password
        cy.get('[type=submit]').click();

        cy.contains('Your account is not approved yet.')
    });

    it('Admin can sign in', () => {
        cy.get('#email').type('admin@admin.com');
        cy.get('#password').type('admin'); // secret password
        cy.get('[type=submit]').click();

        // only exists on successful sign up
        cy.get('.profile-icon')
            .should('exist')
            .filter(':visible')
            .click();
        
        cy.contains('Mister Admin'); // from profile page

        cy.get('#sign-out').click();
        cy.contains('Welcome Back');
    })

    it('User with wrong password doesn\'t sign in', () => {
        cy.get('#email').type('user@user.com');
        cy.get('#password').type('WroNG@PPasswoordt');
        cy.get('[type=submit]').click();

        cy.contains('Invalid email or password.');
    });
});

describe('Register tests', () => {
    const time = Date.now();
    beforeEach(() => {
        cy.visit(`${HOST_LOGIN}`);
    });

    it('User can sign up, can\'t sign in until approved', () => {
        cy.get('a').click()

        cy.get('#first_name').type(`${time}`);
        cy.get('#last_name').type(`${time}`);
        cy.get('#email').type(`${time}@gmail.com`);
        cy.get('#password').type(`${time}`);
        cy.get('#confirm_password').type(`${time}`);
        cy.get('#phone_number').type(`1231231231`);

        cy.get('[type=button]').click();
        cy.get('select').select('Visitor')
        cy.get('select').last().select('Visitor')

        cy.get('[type=button]').last().click();
        cy.get('#driver_license_number').type('123123123');
        cy.get('select').select('NY');
        cy.get('#address_line').type('12 Visitor street');
        cy.get('#city').type('NYork City')
        cy.get('#state_region').type('Yonkers province');
        cy.get('#postal_zip_code').type('00000');
        cy.get('#country').type('America');
        
        cy.get('[type=submit]').click(); // subission

        cy.get('#email').type(`${time}@gmail.com`);
        cy.get('#password').type(`${time}`);
        cy.get('[type=submit]').click();
        cy.contains('Your account is not approved yet.');
    });
});