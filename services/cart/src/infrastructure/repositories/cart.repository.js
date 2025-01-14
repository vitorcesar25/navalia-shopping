const firestore = require('../../../../shared/configs/firestore.config');

/**
 * Retrieves the cart data for a given user from Firestore.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<Object | null>} A promise that resolves to the cart data object if it exists,
 * or `null` if the cart does not exist.
 * 
 * @throws {Error} If there is an issue accessing Firestore.
 */
const getCartByUserId = async (userId) => {
    const doc = await firestore.collection('carts').doc(userId).get();

    if (!doc.exists) {
        return null;
    }

    return doc.data();
}

/**
 * Clears the shopping cart for a given user in the Firestore database.
 *
 * @param {string} userId - The ID of the user whose cart will be cleared.
 * @returns {Promise<void>} Resolves when the cart is successfully cleared.
 */
const clearCartByUserId = async (userId) => {
    const cartRef = firestore.collection('carts').doc(userId);

    await cartRef.set({ items: [] }, { merge: true });
};

module.exports = {
    getCartByUserId,
    clearCartByUserId
};
