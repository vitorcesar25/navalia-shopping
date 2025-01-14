/// <reference types="cypress" />

function resetCart() {
    cy.get('[data-testid="open-cart-button"]', { timeout: 10000 }).click();
    cy.wait(2000);

    cy.document().then((doc) => {
        const emptyMessageExists = doc.querySelector('[data-testid="cart-empty-message"]');
        if (emptyMessageExists) {
            cy.get('[data-testid="cart-empty-message"]');
            cy.get('[data-testid="cart-close-button"]').click();
        } else {
            cy.wait(2000);
            cy.get('[data-testid="cart-clear-button"]', { timeout: 1000 }).click();
            cy.get('[data-testid="cart-close-button"]').click();
        }
    });
}

describe('Promotional Scenarios', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.wait(2000);
        cy.get('[data-testid="login-button"]', { timeout: 1000 }).click();
        cy.get('[data-testid="user-selection"]').click();
        cy.get('.v-list-item', { timeout: 1000 }).contains('VIP User').click();
        cy.get('[data-testid="confirm-login"]').click();
        resetCart();
    });

    it('VIP Customer, 3 Dresses', () => {
        cy.get('[data-testid="add-to-cart-prod-003"]').click();
        cy.wait(2000);

        cy.get('[data-testid="cart-item-prod-003"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);

        cy.get('[data-testid="cart-item-prod-003"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();


        cy.wait(2000);
        cy.get('[data-testid="promotion-recommended-pricing"]')
            
            .should('contain.text', '$161.50');

    });

    it('VIP Customer, 2 Jeans + 2 Dresses', () => {
        cy.get('[data-testid="add-to-cart-prod-002"]').click();
        cy.wait(2000);

        cy.get('[data-testid="cart-item-prod-002"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);            
        cy.get('[data-testid="cart-close-button"]').click();
        cy.wait(1000);    
        cy.get('[data-testid="add-to-cart-prod-003"]').click();
        cy.wait(2000);

        cy.get('[data-testid="cart-item-prod-003"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);     

        cy.get('[data-testid="promotion-recommended-pricing"]')
            
            .should('contain.text', '$227.00');
    });

    it('VIP Customer, 4 T-shirts + 1 Jeans', () => {
        cy.get('[data-testid="add-to-cart-prod-001"]').click();
        cy.wait(2000);

        cy.get('[data-testid="cart-item-prod-001"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);   

        cy.get('[data-testid="cart-item-prod-001"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);   

        cy.get('[data-testid="cart-item-prod-001"]')
            .find('[data-testid="increase-quantity"]')
            
            .click();
        cy.wait(2000);   

        cy.get('[data-testid="cart-close-button"]').click();
        cy.wait(1000);    
        cy.get('[data-testid="add-to-cart-prod-002"]').click();
        cy.wait(2000);

        cy.get('[data-testid="promotion-recommended-pricing"]')
            
            .should('contain.text', '$173.47');
    });

});