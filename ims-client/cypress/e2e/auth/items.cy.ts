describe('Items Page', () => {
    beforeEach(() => {
        // Visit the Login page
        cy.visit('/login'); 

        // Fill in login credentials
        cy.get('[data-testid=username]').type('admin'); 
        cy.get('[data-testid=password]').type('Admin123!'); 

        // Submit the login form
        cy.get('[data-testid=login-button]').click(); 

        // Verify that login was successful
        cy.url().should('not.include', '/login'); 

        // Visit the Items page after logging in
        cy.visit('/inventory/items');

        // Ensure that items table is visible
        cy.get('[data-testid=items-table]').should('be.visible');
    });

    // *** Begin Add Item Tests ***
    describe('Add Item', () => {
        it('should open add item modal', () => {
            cy.get('[data-testid=add-item-button]').click();
            cy.get('[data-testid=add-item-modal]').should('be.visible');
        });

        it('should add a new item successfully', () => {
            // Open modal
            cy.get('[data-testid=add-item-button]').click();

            // Fill form
            cy.get('[data-testid=item-name-input]').type('Test Item');
            cy.get('[data-testid=item-unit-input]').type('pcs');
            cy.get('[data-testid=item-description-input]').type('Test Description');
            cy.get('[data-testid=item-price-input]').type('10.99');

            // Submit form
            cy.get('[data-testid=submit-item-button]').click();

            // Verify the new item appears in the table
            cy.get('[data-testid=items-table]')
                .should('contain', 'Test Item')
                .and('contain', 'pcs')
                .and('contain', '10.99');
        });

        it('should close modal when cancel is clicked', () => {
            cy.get('[data-testid=add-item-button]').click();
            cy.get('[data-testid=cancel-button]').click();
            cy.get('[data-testid=add-item-modal]').should('not.exist');
        });
    });
});