import promotionServices from '../../services/promotion.services';

const state = {
    /**
     * List of promotions fetched for the current cart.
     * @type {Array<Object>}
     */
    promotions: [],

    /**
     * ID of the best promotional offer.
     * @type {string|null}
     */
    bestOfferId: null,

    /**
     * Indicates whether the promotion calculation is in progress.
     * @type {boolean}
     */
    promotionLoading: false,

    /**
     * Currently selected promotion by the user.
     * @type {Object|null}
     */
    selectedPromotion: null,
};

const mutations = {
    /**
     * Sets the promotions in the state.
     * @param {Object} state - Vuex state.
     * @param {Array<Object>} promotions - The fetched promotions.
     */
    setPromotions(state, promotions) {
        state.promotions = promotions;
    },

    /**
     * Sets the ID of the best promotional offer.
     * @param {Object} state - Vuex state.
     * @param {string|null} bestOfferId - The ID of the best offer.
     */
    setBestOfferId(state, bestOfferId) {
        state.bestOfferId = bestOfferId;
    },

    /**
     * Toggles the promotion loading state.
     * @param {Object} state - Vuex state.
     */
    togglePromotionLoading(state) {
        state.promotionLoading = !state.promotionLoading;
    },

    /**
     * Sets the selected promotion in the state.
     * @param {Object} state - Vuex state.
     * @param {Object|null} selectedPromotion - The selected promotion object.
     */
    selectPromotion(state, selectedPromotion) {
        state.selectedPromotion = selectedPromotion;
    },
};

const actions = {
    /**
     * Fetches and calculates promotions for the current cart.
     * @param {Object} context - Vuex action context.
     * @param {Function} context.commit - Vuex commit method.
     * @param {Object} context.rootGetters - Vuex root getters.
     * @returns {Promise<void>} Resolves when promotions are calculated.
     */
    async calculatePromotions({ commit, rootGetters }) {
        const cartItems = rootGetters['cart/getCartItems'];

        if (!cartItems || cartItems.length === 0) {
            console.warn('No items in the cart to calculate promotions.');
            return;
        }

        try {
            commit('togglePromotionLoading');
            const response = await promotionServices.calculatePromotions(cartItems);
            commit('setPromotions', response.data.promotions);
            commit('setBestOfferId', response.data.bestOfferId);
        } catch (error) {
            console.error('Error calculating promotions:', error.message);
            alert('Unable to calculate promotions. Please try again later.');
        } finally {
            commit('togglePromotionLoading');
        }
    },
};

const getters = {
    /**
     * Gets the list of promotions.
     * @param {Object} state - Vuex state.
     * @returns {Array<Object>} The list of promotions.
     */
    getPromotions(state) {
        return state.promotions;
    },

    /**
     * Gets the promotion loading state.
     * @param {Object} state - Vuex state.
     * @returns {boolean} True if promotions are being calculated.
     */
    getPromotionLoading(state) {
        return state.promotionLoading;
    },

    /**
     * Gets the ID of the best promotional offer.
     * @param {Object} state - Vuex state.
     * @returns {string|null} The ID of the best offer.
     */
    getBestOfferId(state) {
        return state.bestOfferId;
    },

    /**
     * Gets the currently selected promotion.
     * @param {Object} state - Vuex state.
     * @returns {Object|null} The selected promotion object.
     */
    getSelectedPromotion(state) {
        return state.selectedPromotion;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};