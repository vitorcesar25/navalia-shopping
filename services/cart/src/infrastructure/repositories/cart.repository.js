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

module.exports = {
    getCartByUserId
};