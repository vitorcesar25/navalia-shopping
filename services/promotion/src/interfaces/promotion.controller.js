const { calculatePromotions } = require('../application/calculatePromotions.usecase');

/**
 * Controller for calculating promotions for a user's cart.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Array<Object>} req.body.cartItems - The items in the user's cart.
 * @param {boolean} req.user.isVip - Whether the user is VIP.
 * @param {Object} res - The HTTP response object.
 */
exports.calculatePromotions = async (req, res) => {
    const { cartItems } = req.body;
    const isVip = req.user.isVip;

    const result = await calculatePromotions(cartItems, isVip);
    
    res.status(200).json({
        message: 'Promotions calculated successfully',
        data: result,
    });
};