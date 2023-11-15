
// login first as Jesse, send out 40 messages, then logout, 
// then login as Tommy to see if the previous 10 messages are there

describe('login could see 10 previous messages', () => {
    it('successfully passed', () => {
      cy.visit('http://localhost:3000');
      cy.get('#loginUserName').click().type('Jesse{enter}');
      cy.get('#test1').click();
      for (let ct = 1; ct <= 40; ct++){
        cy.get('#message').click().type(`${ct} {enter}`);    
      }
      cy.get('#retrunToLoginPage') .click();
      cy.get('#loginUserName').click().clear().type('Tommy{enter}');
      cy.get('#test1').click();
      cy.get('.scrollable-text-view').children().should('have.length', 10);
    
  })
});

// click on the check message button to see the previous messages
// after click the btn once, total message number should be 20
describe('login could see 10 previous messages', () => {
  it('successfully passed', () => {
    cy.visit('http://localhost:3000');
    cy.get('#loginUserName').click().type('Jesse{enter}');
    cy.get('#test1').click();
    for (let ct = 1; ct <= 40; ct++){
      cy.get('#message').click().type(`${ct} {enter}`);    
    }
    cy.get('#retrunToLoginPage') .click();
    cy.get('#loginUserName').click().clear().type('Tommy{enter}');
    cy.get('#test1').click();
    cy.get('.scrollable-text-view').children().should('have.length', 10);
    cy.get('#getMessageBtn').click();
    cy.get('.scrollable-text-view').children().should('have.length', 20);
})
});