const firestore = require('../../../../shared/configs/firestore.config');


/**
 * Fetches products with pagination support.
 *
 * @async
 * @function getProducts
 * @param {Object} options - Pagination options.
 * @param {number} options.limit - The maximum number of products to fetch.
 * @param {string} [options.startAfter] - The ID of the last product from the previous page.
 * @returns {Promise<products: Array<Object>>} The paginated products.
 * @throws {Error} Throws an error if fetching products fails.
 */
const getProducts = async (limit = 10, startAfter = null) => {
    try {
        const productsRef = firestore.collection('products');
        let query = productsRef.orderBy('id').limit(limit);

        if (startAfter) {
            const lastProductDoc = await productsRef.doc(startAfter).get();
            if (!lastProductDoc.exists) {
                throw new Error('Invalid startAfter token');
            }
            query = query.startAfter(lastProductDoc);
        }


        const querySnapshot = await query.get();
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.log(`Fetching products with limit: ${limit}, startAfter: ${startAfter}`);
        throw new Error('Error fetching products:', error.message);
    }
};

module.exports = {
    getProducts
};