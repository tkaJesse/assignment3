
// user story 1-2
// a chat window is integrated within the spreadsheet
describe('chat window integrated', () => {
    it('success', () => {
      cy.visit('http://localhost:3000');
      cy.get('#loginUserName').click().type('Jesse{enter}');
      cy.get('#test1').click();
      cy.get('.scrollable-text-view').should('exist');
      cy.get('#message').should('exist');  
      cy.get('#sendBtn').should('exist').should('not.be.disabled');;    
       })
  });

// user story 3-4
// only the recent 10 messages are displayed in the chat window
describe('chat window integrated', () => {
    it('success', () => {
        cy.visit('http://localhost:3000');
        cy.get('#loginUserName').click().type('Jesse{enter}');
        cy.get('#test1').click();
        for (let ct = 1; ct <= 25; ct++){
            cy.get('#message').click().type(`${ct} {enter}`);    
        }
        cy.get('.scrollable-text-view').children().should('have.length', 10);
    })
});

// user story 5
// retrieve previous messages
describe('chat window integrated', () => {
    it('success', () => {
        cy.visit('http://localhost:3000');
        cy.get('#loginUserName').click().type('Jesse{enter}');
        cy.get('#test1').click();
        for (let ct = 1; ct <= 25; ct++){
            cy.get('#message').click().type(`${ct} {enter}`);    
        }
        cy.get('#getMessageBtn').click();
        cy.get('.scrollable-text-view').children().should('have.length', 20);
        cy.get('#getMessageBtn').click();
        cy.get('.scrollable-text-view').children().should('have.length', 25);
 
    })
});

// user stroy 6 
// message order maintained

describe('maintain chat message order', () => {
    it('successfully passed', () => {
      cy.visit('http://localhost:3000');
      cy.get('#loginUserName').click().type('Jesse{enter}');
      cy.get('#test1').click();
      cy.get('#message').click().type('say hi to tommy{enter}');  
      cy.get('#retrunToLoginPage') .click();
      cy.get('#loginUserName').click().clear().type('Tommy{enter}');
      cy.get('#test1').click();
      cy.get('.scrollable-text-view').children().last().contains("Jesse: say hi to tommy").should('exist');
      cy.get('#message').click().type('say hi to Jesse{enter}');
      cy.get('.scrollable-text-view').children().last().contains("Tommy: say hi to Jesse").should('exist');
      cy.get('#retrunToLoginPage') .click();
      cy.get('#loginUserName').click().type('Jesse{enter}');
      cy.get('#test1').click();
      cy.get('.scrollable-text-view').children().last().contains("Tommy: say hi to Jesse").should('exist');
    })
  });