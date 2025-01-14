const Promotion = require('./Promotion');
const { UnprocessableEntityError } = require('../../../shared/errors/CustomErrors');

class BuyXPayYPromotion extends Promotion {
    constructor(id, name, vipOnly, customConfig) {
        super(id, name, 'buyXPayY', vipOnly);

        if (!customConfig || !customConfig?.buy || !customConfig?.pay ||
            customConfig.buy <= 0 || customConfig.pay <= 0) {
            throw new UnprocessableEntityError(
                'Buy and pay values are required for "Buy X Pay Y" promotions'
            );
        }

        this.buy = customConfig.buy;
        this.pay = customConfig.pay;
    }

    apply(cartItems) {
        if (!Array.isArray(cartItems)) {
            throw new Error('Invalid cartItems provided');
        }

        const expandedItems = cartItems.flatMap(item =>
            Array(item.quantity).fill({ ...item, quantity: 1 })
        );

        expandedItems.sort((a, b) => a.price - b.price);

        const totalItems = expandedItems.length;
        const sets = Math.floor(totalItems / this.buy);
        const freeItemsCount = sets * (this.buy - this.pay);

        let discountedItems = expandedItems.slice(0, freeItemsCount);

        this.discountInCents = discountedItems.reduce((acc, item) => {
            return acc + Math.round(item.price * 100);
        }, 0);

        this.totalInCents = cartItems.reduce((total, item) => {
            return total + Math.round((item.price || 0) * 100) * item.quantity;
        }, 0);

        this.subtotalInCents = this.totalInCents - this.discountInCents;

        this.convertCentsToDollars();
    }
}

module.exports = BuyXPayYPromotion;
