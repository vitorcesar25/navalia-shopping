import productServices from '../../services/product.services';

const PAGINATION_LIMIT = 6;

const state = {
    /**
     * Stores paginated data for products.
     * @type {Array<Object>}
     */
    productPageData: [],
};

const mutations = {
    /**
     * Adds a page of product data to the state.
     * 
     * @param {Object} state - Vuex state.
     * @param {Object} page - The product page to add.
     * @param {number} page.pageIndex - Index of the current page.
     * @param {Array<Object>} page.products - Products in the current page.
     * @param {string|null} page.nextPageToken - Token for the next page.
     */
    addProductPage(state, page) {
        state.productPageData.push(page);
    },
};

const actions = {
    /**
     * Fetches products for a given page index.
     * 
     * @param {Object} context - Vuex action context.
     * @param {Function} context.commit - Vuex commit method.
     * @param {Object} context.state - Vuex state.
     * @param {Object} payload - Action payload.
     * @param {number} payload.pageIndex - The index of the page to fetch.
     * @returns {Promise<void>} Resolves when products are fetched and committed.
     */
    async getProducts({ commit, state }, { pageIndex }) {
        try {
            commit('setLoading', true, { root: true });
            let startAfter = null;
            if (pageIndex > 0) {
                const previousPage = state.productPageData[pageIndex - 1];
                startAfter = previousPage?.nextPageToken || null;
            }

            const response = await productServices.getProducts(PAGINATION_LIMIT, startAfter);

            commit('addProductPage', {
                pageIndex,
                products: response.data?.products || [],
                nextPageToken: response.data?.nextPageToken || null,
            });
        } catch (err) {
            console.error('Error fetching products:', err.message);
            alert('There was an error fetching products. Please try again later.');
        } finally {
            commit('setLoading', false, { root: true });
        }
    },
};

const getters = {
    /**
     * Retrieves a product by its ID.
     * 
     * @param {Object} state - Vuex state.
     * @returns {Function} Function to get a product by its ID.
     */
    getProductById: (state) => (id) => {
        const allProducts = state.productPageData.flatMap((page) => page.products || []);
        return allProducts.find((product) => product.id === id) || null;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};