import { createStore } from 'vuex';
import cart from './modules/cart';
import product from './modules/product';
import promotion from './modules/promotion';
import user from './modules/user';

export default createStore({
    state: {
        loading: false,
    },
    mutations: {
        setLoading(state, loading) {
            state.loading = loading;
        }
    },
    getters: {
        isLoading(state) {
            return state.loading;
        }
    },
    actions: {

    },
    modules: {
        cart,
        product,
        promotion,
        user,
    },
});
