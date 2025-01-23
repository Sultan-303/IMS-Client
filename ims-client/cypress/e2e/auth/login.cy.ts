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
        
        cy.get('[data-testid=username]').type('admin');
        cy.get('[data-testid=password]').type('Admin123!'); 

        cy.get('[data-testid=login-button]').click();

        cy.url().should('include', '/inventory/items'); 
        cy.get('[data-testid=items-table]').should('be.visible'); 
    });
});