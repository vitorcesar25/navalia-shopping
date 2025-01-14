/**
 * Base class for all promotions.
 */
class Promotion {
    /**
     * Creates a new Promotion instance.
     * 
     * @param {string} id - The unique ID of the promotion.
     * @param {string} name - The name of the promotion.
     * @param {string} type - The type of the promotion ('buyXPayY' or 'percentage').
     * @param {boolean} vipOnly - Whether the promotion is only for VIP customers.
     */
    constructor(id, name, type, vipOnly) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.vipOnly = vipOnly;
        this.total = 0;
        this.discount = 0;
        this.subtotal = 0;
        this.totalInCents = 0;
        this.discountInCents = 0;
        this.subtotalInCents = 0;
    }

    /**
     * Abstract method to apply the promotion.
     * Must be implemented by subclasses.
     * 
     * @param {Array<Object>} cartItems - The items in the cart.
     */
    apply(cartItems) {
        throw new Error('Method "apply" must be implemented in subclasses');
    }

    /**
     * Converts cent-based properties to dollar values with two decimal places.
     */
    convertCentsToDollars() {
        this.total = (this.totalInCents / 100);
        this.discount = (this.discountInCents / 100);
        this.subtotal = (this.subtotalInCents / 100);
    }
}

module.exports = Promotion;