const { fetchProductsByIds } = require('../../../../product/src/application/getProducts.usecase');

/**
 * Retrieves product metadata for a given list of product IDs.
 * 
 * @param {Array<string>} productIds - An array of product IDs to fetch metadata for.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of product metadata.
 * Each metadata object should include details like name, price, and photo.
 * 
 * @throws {Error} If fetching the product metadata fails.
 */
const getProductsMetadata = async (productIds) => {
    return await fetchProductsByIds(productIds);
};

module.exports = {
    getProductsMetadata,
};