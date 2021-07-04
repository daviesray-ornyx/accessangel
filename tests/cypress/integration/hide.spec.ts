context('ACE Hide', () => {
  beforeEach(() => {
    cy.visit('/button/');
    cy.get('#enable').click();
  });

  it('should hide ACE', () => {
    cy.get('#ab-hide').click().should('have.descendants', '.ab-icon-nav-down');
  });
});
