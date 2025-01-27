const firestore = require("../../../../shared/configs/firestore.config");

/**
 * Fetches products with pagination support from Firestore.
 *
 * @async
 * @function getProducts
 * @param {number} [limit=10] - The maximum number of products to fetch. Defaults to 10.
 * @param {string|null} [startAfter=null] - The ID of the last product from the previous page, used for pagination. Defaults to null.
 * @return {Promise<Array<Object>>} Resolves to an array of product objects. Each object contains the product ID and its associated Firestore data.
 * @throws {Error} Throws an error if fetching products fails.
 */
const getProducts = async (limit = 10, startAfter = null) => {
  try {
    const productsRef = firestore.collection("products");
    let query = productsRef.orderBy("id").limit(limit);

    if (startAfter) {
      const lastProductDoc = await productsRef.doc(startAfter).get();
      if (!lastProductDoc.exists) {
        throw new Error("Invalid startAfter token");
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
    throw new Error("Error fetching products:", error.message);
  }
};


/**
 * Fetches product data by their IDs from Firestore.
 *
 * This function retrieves product data for the specified product IDs, filters out non-existent documents,
 * and maps the data into a consumable format using Firestore's `getAll` method for efficient batch retrieval.
 *
 * @async
 * @function fetchProductsByIds
 * @param {string[]} productIds - An array of product IDs to fetch. If the array is empty, the function returns an empty array.
 * @return {Promise<Array<Object>>} Resolves to an array of product objects. Each object contains the product ID and its associated Firestore data.
 * @throws {Error} Throws an error if fetching products from Firestore fails.
 */
const fetchProductsByIds = async (productIds) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }
  try {
    const productRefs = productIds.map((id) => firestore.collection("products").doc(id));

    const productSnapshots = await firestore.getAll(...productRefs);

    return productSnapshots
        .filter((snapshot) => snapshot.exists)
        .map((snapshot) => ({
          id: snapshot.id,
          ...snapshot.data(),
        }));
  } catch (error) {
    throw new Error(`Error fetching products: ${error.message}`);
  }
};

module.exports = {
  fetchProductsByIds,
  getProducts,
};
