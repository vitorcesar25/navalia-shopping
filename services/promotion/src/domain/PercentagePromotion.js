const Promotion = require('./Promotion');

/**
 * Represents a percentage-based promotion.
 */
class PercentagePromotion extends Promotion {
    /**
     * Creates a new PercentagePromotion instance.
     *
     * @param {string} id - The unique ID of the promotion.
     * @param {string} name - The name of the promotion.
     * @param {boolean} vipOnly - Whether the promotion is VIP only.
     * @param {Object} customConfig - Custom configuration for the promotion.
     * @param {number} customConfig.percentage - The discount percentage (e.g., 10 for 10%).
     */
    constructor(id, name, vipOnly, customConfig) {
        super(id, name, 'percentage', vipOnly);
        const { percentage } = customConfig;
        this.percentage = percentage;
    }

    /**
     * Applies the promotion to the cart.
     *
     * @param {Array<Object>} cartItems - The items in the cart.
     */
    apply(cartItems) {
        this.totalInCents = cartItems.reduce(
            (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
            0
        );

        this.discountInCents = Math.round(this.totalInCents * (this.percentage / 100));
        this.subtotalInCents = this.totalInCents - this.discountInCents;

        this.convertCentsToDollars();
    }
}

module.exports = PercentagePromotion;