describe('Hello World Test', () => {
  it('should display the welcome message', () => {
    cy.visit('/');
    cy.contains('Get started by editing app/page.tsx.');
  });
});