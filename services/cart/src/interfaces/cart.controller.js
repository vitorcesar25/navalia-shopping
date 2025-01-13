const { getCartByUserId } = require('../application/getCart.usecase');
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

