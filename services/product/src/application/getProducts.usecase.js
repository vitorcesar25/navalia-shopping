const productRepository = require('../infrastructure/repositories/product.repository');
const Product = require('../domain/Product');

/**
 * Maps product data from the data source to Product domain entities.
 *
 * @param {Array<Object>} products - Array of product data objects from the repository.
 * @returns {Product[]} An array of Product domain entities.
 */
const mapProductsDataToEntities = (products) => {
    return products.map(
        (data) =>
            new Product(data.id, data.name, data.price, data.photo || '')
    );
};

/**
 * Fetches products with pagination support and maps them to domain entities.
 *
 * @async
 * @function getProducts
 * @param {number} [limit=10] - The maximum number of products to fetch.
 * @param {string|null} [startAfter=null] - The ID of the last product from the previous page for pagination.
 * @returns {Promise<{ products: Product[], nextPageToken: string|null }>} 
 *          A promise that resolves to an object containing the array of Product domain entities and a next page token.
 * @throws {Error} Throws an error if the repository fails to fetch products.
 */
const getProducts = async (limit = 10, startAfter = null) => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const productData = await productRepository.getProducts(limit, startAfter);
    const products = mapProductsDataToEntities(productData);
    const nextPageToken = products.length === limit ? products[products.length - 1].id : null;
    return { products, nextPageToken };
};

module.exports = { getProducts };