Cypress.Commands.add('ensureCartIsEmpty', () => {
    // Open the cart
    cy.get('[data-testid="open-cart-button"]').click();

    // Check if the cart has items
    cy.get('body').then(($body) => {
        if ($body.find('[data-testid="cart-clear-button"]').length > 0) {
            // Clear the cart
            cy.get('[data-testid="cart-clear-button"]').click();
        }
    });

    // Close the cart
    cy.get('[data-testid="open-cart-button"]').click();
});