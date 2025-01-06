describe('Login Page', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display login form', () => {
        cy.get('[data-testid=username]').should('exist');
        cy.get('[data-testid=password]').should('exist');
        cy.get('[data-testid=login-button]').should('exist');
    });

    it('should handle successful login', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 200,
            body: { token: 'fake-token' }
        }).as('loginRequest');

        cy.get('[data-testid=username]').type('testuser');
        cy.get('[data-testid=password]').type('password');
        cy.get('[data-testid=login-button]').click();

        cy.wait('@loginRequest');
        cy.url().should('include', '/dashboard');
    });

    it('should show error on failed login', () => {
        cy.intercept('POST', '/api/auth/login', {
            statusCode: 401,
            body: { message: 'Invalid credentials' }
        }).as('loginRequest');

        cy.get('[data-testid=username]').type('wrong');
        cy.get('[data-testid=password]').type('wrong');
        cy.get('[data-testid=login-button]').click();

        cy.wait('@loginRequest');
        cy.get('[data-testid=error-message]').should('be.visible');
    });
});