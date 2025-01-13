const { NotFoundError } = require('../../../shared/errors/CustomErrors');

/**
 * Represents an item in the shopping cart.
 */
class CartItem {
    /**
     * The unique identifier of the product.
     * @type {string}
     */
    productId;

    /**
     * The quantity of the product in the cart.
     * @type {number}
     */
    quantity;

    /**
     * The name of the product (enriched later).
     * @type {string}
     */
    name;

    /**
     * The price of the product (enriched later).
     * @type {number}
     */
    price;


    /**
     * The price of the product in cents (enriched later).
     * @type {number}
     */
    priceInCents;

    /**
     * The photo URL of the product (enriched later).
     * @type {string}
     */
    photo;

    /**
     * Creates a new cart item.
     * @param {string} productId - The unique identifier of the product.
     * @param {number} quantity - The quantity of the product in the cart.
     */
    constructor(productId, quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    /**
     * Enriches the cart item with additional product metadata.
     * 
     * @param {Object} metadata - Metadata for the product.
     * @param {string} [metadata.name] - The name of the product.
     * @param {number} [metadata.price] - The price of the product.
     * @param {string} [metadata.photo] - The photo URL of the product.
     * @throws {NotFoundError} If the metadata is missing or null.
     */
    enrich(metadata) {
        if (!metadata) {
            throw new NotFoundError(`Product with ID ${this.productId} not found`);
        }
        this.name = metadata.name || 'Unknown Product';
        this.price = metadata.price || 0;
        this.priceInCents = this.price * 100;
        this.photo = metadata.photo || '';
    }


    /**
     * Serializes the CartItem instance to a plain object with basic properties.
     *
     * @returns {Object} Serialized representation of the CartItem.
     */
    serialize() {
        return {
            productId: this.productId,
            quantity: this.quantity,
        };
    }
}

module.exports = CartItem;