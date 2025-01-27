const CartItem = require('./CartItem');

/**
 * Represents a shopping cart.
 */
// eslint-disable-next-line no-unused-vars
class Cart {
    /**
     * @type {string} The identifier of the user owning the cart.
     */
    userId;

    /**
     * @type {CartItem[]} The list of items in the cart.
     */
    items = [];

    /**
     * @type {number} The total cost of all items in the cart.
     */
    total;

    /**
     * @type {number} The total cost of all items in the cart.
     */
    totalInCents;

    /**
     * @param {string} userId - The unique identifier of the user.
     * @param {Array<{ productId: string, quantity: number }>} items - The initial items in the cart.
     */
    constructor(userId, items = []) {
        this.userId = userId;
        this.items = items.map((item) => new CartItem(item.productId, item.quantity));
    }

    /**
     * Enrich all cart items with product metadata.
     * @param {Array<{ id: string, name: string, price: number, photo: string }>} productMetadata - The metadata of the products.
     * @throws {Error} If any product metadata is missing.
     */
    enrichItems(productMetadata) {
        this.items.forEach((item) => {
            const metadata = productMetadata.find((meta) => meta.id === item.productId);
            item.enrich(metadata);
        });
    }

    /**
     * Calculate the total cost of the cart.
     * @returns {number} The total cost of all items in the cart, formatted to two decimal places.
     */
    calculateTotal() {
        this.totalInCents = this.items.reduce(
            (total, item) => total + item.priceInCents * item.quantity,
            0
        );
        this.total = Number((this.totalInCents / 100).toFixed(2));
        return this.total;
    }

    /**
     * Get the user ID associated with the cart.
     * @returns {string} The user ID.
     */
    getUserId() {
        return this.userId;
    }


    /**
     * Add or update an item in the cart.
     * @param {string} productId - The ID of the product.
     * @param {number} quantity - The quantity to add (positive or negative).
     */
    addItem(productId, quantity) {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const existingItem = this.items.find((item) => item.productId === productId);

        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            this.items.push(new CartItem(productId, quantity));
        }
    }

    /**
     * Remove an item from the cart.
     * @param {string} productId - The ID of the product to remove.
     */
    removeItem(productId) {
        this.items = this.items.filter((item) => item.productId !== productId);
    }

    /**
     * Serialize the cart to a plain object.
     * @returns {Object} The serialized cart.
     */
    getCartItemsSerialized() {
        return this.items.map((item) => item.serialize());
    }
}

module.exports = Cart;