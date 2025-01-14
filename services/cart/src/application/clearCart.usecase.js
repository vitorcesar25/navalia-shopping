const Cart = require('../domain/Cart');
const cartRepository = require('../infrastructure/repositories/cart.repository');

/**
 * Clears the shopping cart for a given user by removing all items.
 *
 * @async
 * @function clearCart
 * @param {string} userId - The ID of the user whose cart will be cleared.
 * @returns {Promise<void>} Resolves when the cart is successfully cleared.
 * @throws {Error} Throws an error if the cart could not be cleared.
 */
const clearCartByUserId = async (userId) => {
    await cartRepository.clearCartByUserId(userId);
    return new Cart(userId, []);
};

module.exports = { clearCartByUserId };