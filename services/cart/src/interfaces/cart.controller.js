const { getCartByUserId } = require('../application/getCart.usecase');
const { clearCartByUserId } = require('../application/clearCart.usecase');
const { updateCartItem } = require('../application/updateCartItem.usecase');
const { getProductsMetadata } = require('../infrastructure/integrations/product.integration');

/**
 * Controller for handling the GET /carts endpoint.
 * Retrieves the cart for a given user and sends it as a JSON response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {string} req.user - The unique user object, from authentication.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {Promise<void>} Sends a JSON response with the cart data and a 200 status code.
 * 
 * @throws {Error} If there is an issue retrieving the cart or processing the request.
 */
exports.getCartByUserId = async (req, res) => {
    const { userId } = req.user;
    const cart = await getCartByUserId(userId, getProductsMetadata);
    res.status(200).json({ data: cart, message: "" });
};


/**
 * Controller for handling the DELETE /carts endpoint.
 * Handles the API request to clear the user's cart.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {string} req.user - The unique user object, from authentication.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {Promise<void>} Sends a JSON response with the cart data and a 200 status code.
 * @throws {Error} If there is an issue retrieving the cart or processing the request.
 */
exports.clearCartByUserId = async (req, res) => {
    const { userId } = req.user;
    const cart = await clearCartByUserId(userId);
    res.status(200).json({ data: cart, message: "" });
};


/**
 * Controller for handling the PATCH /carts/items endpoint.
 * Handles the API request to update an item in the user's cart.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {string} req.user - The unique user object, from authentication.
 * @param {Object} res - The HTTP response object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.productId - The ID of the product to update.
 * @param {number} req.body.quantity - The quantity to set (positive to add/update, 0 or negative to remove).
 * 
 * 
 * @returns {Promise<void>} Sends a JSON response with the updated cart data and a 200 status code.
 * @throws {Error} If there is an issue updating the cart or processing the request.
 */
exports.updateCartItem = async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    const cart = await updateCartItem(userId, productId, quantity);
    res.status(200).json({ data: cart, message: "Cart Item updated successfully." });
}