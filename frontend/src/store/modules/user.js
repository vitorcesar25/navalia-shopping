const state = {
    user: null,
};

const mutations = {
    setUser(state, user) {
        state.user = user;
    },
    logout(state) {
        state.user = null;
    },
};

const actions = {

    async login({ commit }, userData) {
        commit('setUser', userData);
        localStorage.setItem('authToken', userData.jwt);
    },

};
const MOCK_USERS = [
    { id: 'user1', name: "VIP User", isVip: true, jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMSIsImlzVmlwIjp0cnVlfQ.IcNtPaxe5sYRd1SoJfz20ZiJ38A0fSg_afzNafHfWe8' },
    { id: 'user2', name: "Common User", isVip: false, jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMiIsImlzVmlwIjpmYWxzZSwiaWF0IjoxNzM2ODEwMjI1fQ.m3q0dFeFqMGBFRhF1VbkR6c7xnIZWyYTotPolT0J7Ho' },
];
const getters = {
    mockAvailableUsers() {
        return MOCK_USERS
    },
    getUser(state) {
        if (!state.user) {
            localStorage.setItem('authToken', MOCK_USERS[0].jwt);
            return MOCK_USERS[0];
        }
        return state.user;
    },
    getUserName(state) {
        return state.user?.name || null;
    },
    isVipUser(state) {
        return state.user?.isVip || false;
    },
    getUserId(state) {
        return state.user?.id || null;
    },
    getJwt(state) {
        return state.user?.jwt || null;
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};