const { fetchProductsByIds, getProducts } = require('../application/getProducts.usecase');

/**
 * Handles the fetching of products by their IDs.
 * 
 * @module fetchProductsByIds
 * @requires ../application/getProducts.usecase
 * 
 * @async
 * @function fetchProductsByIds
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The request body containing the product IDs.
 * @param {string[]} req.body.productIds - An array of product IDs to fetch.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>} Responds with a JSON object containing the products.
 * @throws {Error} If the `fetchProductsByIds` use case fails.
 */
exports.fetchProductsByIds = async (req, res) => {
    const { productIds } = req.body;
    const products = await fetchProductsByIds(productIds);
    res.status(200).json({ message: '', data: products });
};

/**
 * Handles the fetching of paginated products.
 * 
 * @module getProducts
 * @requires ../application/getProducts.usecase
 * 
 * @async
 * @function getProducts
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} req.query.limit - The maximum number of products to fetch.
 * @param {string} [req.query.startAfter] - The ID of the last product from the previous page (optional).
 * @param {Object} res - The Express response object.
 * 
 * @returns {Promise<void>} Responds with a JSON object containing paginated products and metadata.
 * @throws {Error} If the `getProducts` use case fails.
 */
exports.getProducts = async (req, res) => {
    const { limit, startAfter } = req.query;
    const { products, nextPageToken } = await getProducts(limit, startAfter);
    res.status(200).json({ message: '', data: { products, nextPageToken } });
};
