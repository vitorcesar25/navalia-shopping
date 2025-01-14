const firestore = require('../../../../shared/configs/firestore.config');

/**
 * Repository for interacting with the promotions collection in Firestore.
 *
 * @module promotionRepository
 */

/**
 * Retrieves all promotions from Firestore.
 *
 * @async
 * @function getAllPromotions
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of promotion objects.
 * @throws {Error} If there is an error while fetching promotions from Firestore.
 */
const getActivePromotions = async () => {
    try {
        const querySnapshot = await firestore.collection('promotions').where('active', "==", true).get();
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error fetching promotions:', error.message);
        throw new Error('Failed to fetch promotions');
    }
};

module.exports = {
    getActivePromotions
}