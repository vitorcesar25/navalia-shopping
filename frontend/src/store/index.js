import { createStore } from 'vuex';
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
        user,
    },
});
