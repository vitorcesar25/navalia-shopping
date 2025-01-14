const promotionRepository = require('../infrastructure/repositories/promotion.repository');
const BuyXPayYPromotion = require('../domain/BuyXPayYPromotion');
const PercentagePromotion = require('../domain/PercentagePromotion');
const { BadRequestError } = require('../../../shared/errors/CustomErrors');

/**
 * Validates the cart items.
 * 
 * @param {Array<Object>} cartItems - The items in the cart.
 * @throws {BadRequestError} If the cart is empty or undefined.
 */
const validateCartItems = (cartItems) => {
    if (!cartItems || !cartItems.length) {
        throw new BadRequestError('Cart items are required');
    }
};

/**
 * Filters and maps promotions to their respective instances.
 * 
 * @param {Array<Object>} promotions - The list of promotions.
 * @param {boolean} isVip - Whether the user is a VIP.
 * @param {Array<Object>} cartItems - The items in the cart.
 * @returns {Array<Object>} The applied promotions.
 */
const filterAndMapPromotions = (promotions, isVip, cartItems) => {
    const promotionClasses = {
        'buy-x-pay-y': BuyXPayYPromotion,
        'percentage': PercentagePromotion,
    };

    return promotions
        .filter((promotion) => isVip || !promotion.vipOnly)
        .map((promotion) => {
            const PromotionClass = promotionClasses[promotion.type];
            const promotionInstance = new PromotionClass(
                promotion.id,
                promotion.name,
                promotion.vipOnly,
                promotion.customConfig
            );
            promotionInstance.apply(cartItems);
            return promotionInstance;
        }).filter((promotion) => promotion.discount > 0);
};

/**
 * Finds the promotion with the highest discount.
 * 
 * @param {Array<Object>} promotions - The applied promotions.
 * @returns {Object|null} The best promotion.
 */
const findBestPromotion = (promotions) => {
    return promotions.reduce((best, current) => {
        return !best || current.discount > best.discount ? current : best;
    }, null);
};

/**
 * Calculates promotions for a given cart and user type.
 *
 * @param {Array<Object>} cartItems - The items in the cart.
 * @param {boolean} isVip - Whether the user is a VIP.
 * @returns {Promise<Object>} The applied promotions and the best offer.
 */
const calculatePromotions = async (cartItems, isVip) => {
    validateCartItems(cartItems);

    const promotions = await promotionRepository.getActivePromotions();

    const appliedPromotions = filterAndMapPromotions(promotions, isVip, cartItems);

    const bestPromotion = findBestPromotion(appliedPromotions);

    return {
        promotions: appliedPromotions,
        bestOfferId: bestPromotion?.id || null,
    };
};

module.exports = { calculatePromotions };