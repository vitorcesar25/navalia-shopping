import cartServices from '../../services/cart.services';

const state = {
    cart: {
        items: [],
        total: 0,
    },
    cartDialog: false,
};

const mutations = {
    /**
     * Sets the cart data in the state.
     * @param {Object} state - Vuex state.
     * @param {Object} cart - Cart data to set.
     */
    setCart(state, cart) {
        state.cart = cart;
    },

    /**
     * Sets the visibility of the cart dialog.
     * @param {Object} state - Vuex state.
     * @param {boolean} cartDialog - Dialog visibility state.
     */
    setCartDialog(state, cartDialog) {
        state.cartDialog = cartDialog;
    },

    /**
     * Toggles the cart dialog visibility.
     * @param {Object} state - Vuex state.
     */
    toggleCartDialog(state) {
        state.cartDialog = !state.cartDialog;
    },
};

const actions = {
    /**
     * Fetches the cart data by user ID.
     * @param {Object} context - Vuex action context.
     */
    async getCartByUserId({ commit }) {
        try {
            const response = await cartServices.getCartByUserId();
            commit('setCart', response.data);
        } catch (err) {
            console.error('Error fetching cart:', err.message);
            alert('Unable to fetch your cart. Please try again later.');
        }
    },

    /**
     * Adds an item to the cart or increments its quantity if already present.
     * @param {Object} context - Vuex action context.
     * @param {Object} payload - Payload containing the productId.
     */
    async addToCart({ dispatch, state, commit }, { productId }) {
        try {
            commit('setLoading', true, { root: true });
            const cartItem = state.cart.items.find((item) => item.productId === productId);
            const quantity = cartItem ? cartItem.quantity + 1 : 1;
            await dispatch('updateCartItem', { productId, quantity });
            commit('setCartDialog', true);
        } catch (err) {
            console.error('Error adding item to cart:', err.message);
            alert('Unable to add item to your cart. Please try again later.');
        } finally {
            commit('setLoading', false, { root: true });
        }
    },

    /**
     * Removes an item from the cart by setting its quantity to zero.
     * @param {Object} context - Vuex action context.
     * @param {Object} payload - Payload containing the productId.
     */
    async removeCartItem({ dispatch }, { productId }) {
        await dispatch('updateCartItem', { productId, quantity: 0 });
    },

    /**
     * Updates the quantity of an item in the cart.
     * @param {Object} context - Vuex action context.
     * @param {Object} payload - Payload containing productId and quantity.
     */
    async updateCartItem({ commit, dispatch }, { productId, quantity }) {
        try {
            commit('setLoading', true, { root: true });
            if (quantity !== 0 || confirm('Are you sure you want to remove this item from your cart?')) {
                await cartServices.updateCartItem(productId, quantity);
                await dispatch('getCartByUserId');
            }
        } catch (err) {
            console.error('Error updating cart item:', err.message);
            alert('Unable to update cart item. Please try again later.');
        } finally {
            commit('setLoading', false, { root: true });
        }
    },

    /**
     * Clears all items from the cart.
     * @param {Object} context - Vuex action context.
     */
    async clearCart({ commit }) {
        try {
            commit('setLoading', true, { root: true });
            if (confirm('Are you sure you want to clear your cart?')) {
                const response = await cartServices.clearCartByUserId();
                commit('setCart', response.data);
            }
        } catch (err) {
            console.error('Error clearing cart:', err.message);
            alert('Unable to clear your cart. Please try again later.');
        }finally{
            commit('setLoading', false, { root: true });
        }
    },

    /**
     * Proceeds with the checkout process from the cart.
     * Ensures a promotion is selected before continuing.
     * @param {Object} context - Vuex action context.
     */
    async continueFromCart({ commit, rootGetters }) {
        const selectedPromotion = rootGetters['promotion/getSelectedPromotion'];

        if (!selectedPromotion) {
            alert('Please select a promotional offer to proceed with your order.');
            return;
        }

        commit('toggleCartDialog');
        alert(`Your order has been placed successfully! The promotion has been applied.`);
    },
};

const getters = {
    /**
     * Checks if the cart contains items.
     * @param {Object} state - Vuex state.
     * @returns {boolean} True if the cart has items, false otherwise.
     */
    hasCartItems: (state) => state.cart?.items?.length > 0,

    /**
     * Gets the items in the cart.
     * @param {Object} state - Vuex state.
     * @returns {Array<Object>} The list of cart items.
     */
    getCartItems: (state) => state.cart?.items || [],

    /**
     * Gets the total cost of the cart.
     * @param {Object} state - Vuex state.
     * @returns {number} The total cost of the cart.
     */
    getCartTotal: (state) => state.cart?.total || 0,

    /**
     * Gets the cart dialog visibility state.
     * @param {Object} state - Vuex state.
     * @returns {boolean} True if the cart dialog is visible, false otherwise.
     */
    getCartDialog: (state) => state.cartDialog,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};