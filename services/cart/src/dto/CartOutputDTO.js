/**
 * Represents the data transfer object (DTO) for a shopping cart.
 * Used to transform domain entities into a format suitable for external layers (e.g., API responses).
 */
class CartOutputDTO {
    /**
     * The list of items in the shopping cart.
     * @type {Array<{ productId: string, name: string | null, price: number | null, quantity: number, photo: string | null }>}
     */
    items;

    /**
     * The total cost of the shopping cart.
     * @type {number}
     */
    total;

    /**
     * Creates a new CartOutputDTO instance.
     *
     * @param {Object} cart - The cart domain entity.
     * @param {Array<{ productId: string, name: string | null, price: number | null, quantity: number, photo: string | null }>} cart.items - The list of cart items.
     * @param {Function} [cart.calculateTotal] - A method to calculate the total cost of the cart. If not provided, the total must be explicitly passed.
     * @param {number} [cart.total=0] - The total cost of the cart. Used if `calculateTotal` is not provided.
     */
    constructor({ items, total = 0 }) {
        this.items = items.map(item => ({
            productId: item.productId,
            name: item.name || null,
            price: item.price || null,
            quantity: item.quantity,
            photo: item.photo || null,
        }));
        this.total = total;
    }
}

module.exports = CartOutputDTO;