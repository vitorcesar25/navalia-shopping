const productRepository = require("../infrastructure/repositories/product.repository");
const Product = require("../domain/Product");
const {NotFoundError} = require("../../../shared/errors/CustomErrors");

/**
 * Maps product data from the data source to Product domain entities.
 *
 * @param {Array<Object>} products - Array of product data objects from the repository.
 * @return {Product[]} An array of Product domain entities.
 */
const mapProductsDataToEntities = (products) => {
  return products.map(
      (data) =>
        new Product(data.id, data.name, data.price, data.priceInCents, data.photo || ""),
  );
};

/**
 * Fetches products with pagination support and maps them to domain entities.
 *
 * @typedef {Object} PaginatedProducts
 * @property {Product[]} products - The array of product entities.
 * @property {string|null} nextPageToken - The next page token.
 *
 * @async
 * @function getProducts
 * @param {number} [limit] - The maximum number of products to fetch. Defaults to 10.
 * @param {string|null} [startAfter] - The ID of the last product from the previous page for pagination. Defaults to null.
 * @return {Promise<PaginatedProducts>} A promise resolving to paginated products and a next page token.
 * @throws {Error} Throws an error if the repository fails to fetch products.
 */
const getProducts = async (limit = 10, startAfter = null) => {
  const productData = await productRepository.getProducts(limit, startAfter);
  const products = mapProductsDataToEntities(productData);
  const nextPageToken = products.length === limit ? products[products.length - 1].id : null;
  return {products, nextPageToken};
};

/**
 * Fetches products by their IDs and maps them to domain entities.
 *
 * @async
 * @function fetchProductsByIds
 * @param {string[]} productIds - Array of product IDs to fetch.
 * @return {Promise<Product[]>} A promise that resolves to an array of Product domain entities.
 * @throws {NotFoundError} Throws an error if one or more product IDs are not found.
 */
const fetchProductsByIds = async (productIds) => {
  const productData = await productRepository.fetchProductsByIds(productIds);

  const fetchedIds = productData.map((data) => data.id);
  const missingIds = productIds.filter((id) => !fetchedIds.includes(id));

  if (missingIds.length > 0) {
    throw new NotFoundError(`Products with the following IDs were not found: ${missingIds.join(", ")}`);
  }

  return mapProductsDataToEntities(productData);
};

module.exports = {fetchProductsByIds, getProducts};
