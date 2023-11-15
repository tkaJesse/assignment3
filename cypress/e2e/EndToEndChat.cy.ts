

// check if the last message matches while editing
// user story 1-2
describe('message match while editing', () => {
  it('successfully passed', () => {
    cy.visit('http://localhost:3000');
    cy.get('#loginUserName').click().type('Jesse{enter}');
    cy.get('#test1').click();
    cy.get('.button-edit-start').click();
    cy.get('#message').click().type('say hi to tommy{enter}');    
    cy.get('#retrunToLoginPage') .click();
    cy.get('#loginUserName').click().clear().type('Tommy{enter}');
    cy.get('#test1').click();
    cy.get('.scrollable-text-view').children().last().contains("say hi to tommy").should('exist');
})
});

// check the chat format whether it matches user: message
// user story 3
describe('check message format', () => {
  it('successfully passed', () => {
    cy.visit('http://localhost:3000');
    cy.get('#loginUserName').click().type('Jesse{enter}');
    cy.get('#test1').click();
    cy.get('.button-edit-start').click();
    cy.get('#message').click().type('say hi to tommy{enter}');    
    cy.get('.scrollable-text-view').children().last().contains("Jesse: say hi to tommy").should('exist');
})
});


// login first as Jesse, send out 40 messages, then logout, 
// then login as Tommy to see if the previous 10 messages are there
// user story 4

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
// user story 5
describe('check previous message', () => {
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


// user story 6, check if chat maintain in order
describe('login could see 10 previous messages', () => {
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
