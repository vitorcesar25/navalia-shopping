const cartRepository = require('../infrastructure/repositories/cart.repository.js');
const Cart = require('../domain/Cart');
const CartOutputDTO = require('../dto/CartOutputDTO');

/**
 * Fetches the cart data for a given user and enriches it with product metadata.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @param {Function} fetchProductMetadata - A function to fetch product metadata. 
 * It should accept an array of product IDs and return metadata for those products.
 * 
 * @returns {Promise<CartOutputDTO>} A DTO containing the enriched cart items and the total cost.
 * 
 * @throws {Error} If there is an issue fetching cart data or product metadata.
 */
const getCartByUserId = async (userId, getProductsMetadata) => {

    const cartData = await cartRepository.getCartByUserId(userId);

    if (!cartData || cartData.items.length === 0) {
        return new CartOutputDTO({ items: [], total: 0 });
    }

    const cart = new Cart(userId, cartData.items);
    const productMetadata = await getProductsMetadata(cart.items.map(item => item.productId));

    cart.enrichItems(productMetadata);
    cart.calculateTotal();

    return new CartOutputDTO(cart);
};

module.exports = { getCartByUserId };