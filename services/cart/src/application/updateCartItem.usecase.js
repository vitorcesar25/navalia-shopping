const cartRepository = require('../infrastructure/repositories/cart.repository');
const Cart = require('../domain/Cart');

/**
 * Updates an item in the user's cart. Can add, update, or remove an item based on the quantity.
 *
 * @async
 * @function updateCartItem
 * @param {string} userId - The ID of the user.
 * @param {string} productId - The ID of the product to update.
 * @param {number} quantity - The quantity to set (positive to add/update, 0 or negative to remove).
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the cart cannot be updated.
 */
const updateCartItem = async (userId, productId, quantity) => {
    const cartData = await cartRepository.getCartByUserId(userId);
    const cart = new Cart(userId, cartData?.items || []);

    //TODO: Check if product exists

    if (quantity > 0) {
        cart.addItem(productId, quantity);
    } else {
        cart.removeItem(productId);
    }
    
    await cartRepository.saveCart(userId, cart.getCartItemsSerialized());

    return cart;
};

module.exports = { updateCartItem };