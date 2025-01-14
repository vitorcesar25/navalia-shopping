const Promotion = require('./Promotion');

/**
 * Represents a "Buy X Pay Y" type promotion.
 */
class BuyXPayYPromotion extends Promotion {
    /**
     * Creates a new BuyXPayYPromotion instance.
     *
     * @param {string} id - The unique ID of the promotion.
     * @param {string} name - The name of the promotion.
     * @param {boolean} vipOnly - Whether the promotion is VIP only.
     * @param {Object} customConfig - Custom configuration for the promotion.
     * @param {number} customConfig.buy - The number of items the user must buy.
     * @param {number} customConfig.pay - The number of items the user will pay for.
     */
    constructor(id, name, vipOnly, customConfig) {
        super(id, name, 'buyXPayY', vipOnly);
        const { buy, pay } = customConfig;
        this.buy = buy;
        this.pay = pay;
    }

    /**
     * Applies the promotion to the cart.
     *
     * @param {Array<Object>} cartItems - The items in the cart.
     * @throws {Error} If cartItems is invalid or undefined.
     */
    apply(cartItems) {
        const expandedItems = cartItems.flatMap((item) =>
            Array(item.quantity).fill({ ...item, quantity: 1 })
        );

        const sortedItems = [...expandedItems].sort((a, b) => a.price - b.price);

        this.discountInCents = 0;

        for (let i = 0; i < sortedItems.length; i += this.buy) {
            const itemsToDiscount = sortedItems.slice(i + this.pay, i + this.buy);
            this.discountInCents += itemsToDiscount.reduce(
                (sum, item) => sum + Math.round(item.price * 100),
                0
            );
        }

        this.totalInCents = cartItems.reduce(
            (total, item) => total + Math.round((item.price || 0) * 100) * item.quantity,
            0
        );

        this.subtotalInCents = this.totalInCents - this.discountInCents;

        this.convertCentsToDollars();
    }
}

module.exports = BuyXPayYPromotion;