// test message only store at the render server instead of the localhost

describe('maintain chat message order', () => {
    it('success at local server', () => {
        cy.visit('http://localhost:3000');
        cy.get('#loginUserName').click().type('Jesse{enter}');
        cy.get('#test1').click();
        for (let ct = 1; ct <= 25; ct++){
            cy.get('#message').click().type(`${ct} {enter}`);    
        }
        cy.get('.scrollable-text-view').children().should('have.length', 35);
    })

    it('success at render server', () => {
        cy.visit('http://localhost:3000');
        cy.get('#loginUserName').click().type('Jesse{enter}');
        cy.get('#test1').click();
        cy.get('#renderhost').click();

        for (let ct = 1; ct <= 20; ct++){
            cy.get('#message').click().type(`${ct} {enter}`);    
        }
        cy.get('.scrollable-text-view').children().should('have.length', 20);
    })


});