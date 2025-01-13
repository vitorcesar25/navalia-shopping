/**
 * Represents a product in the system.
 */
class Product {
    /**
     * Creates a new Product instance.
     * 
     * @param {string} id - The unique identifier for the product.
     * @param {string} name - The name of the product.
     * @param {number} price - The price of the product.
     * @param {string} [photo] - The URL or path to the product's photo (optional).
     */
    constructor(id, name, price, photo) {
        /**
         * The unique identifier for the product.
         * @type {string}
         */
        this.id = id;

        /**
         * The name of the product.
         * @type {string}
         */
        this.name = name;

        /**
         * The price of the product.
         * @type {number}
         */
        this.price = price;


        /**
         * The price in cents of the product.
         * @type {number}
         */
        this.priceInCents = price * 100;

        /**
         * The URL or path to the product's photo.
         * @type {string}
         */
        this.photo = photo;
    }

    /**
     * Serializes the Product instance to a plain object with basic properties.
     *
     * @returns {Object} Serialized representation of the Product.
     */
    serialize() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            priceInCents: this.priceInCents,
            photo: this.photo
        };
    }
}

module.exports = Product;