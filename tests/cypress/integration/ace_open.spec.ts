context('ACE Open', () => {
  beforeEach(() => {
    cy.visit('/button/');
  });

  it('Should open ACE', () => {
    cy.get('#enable').click();

    cy.get('ace-app').should(el => expect(el).to.not.be.undefined);
  });
});
