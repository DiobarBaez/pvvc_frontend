import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      user: {
        id: null,
        name: null,
        rol: null,
        email: null,
      },
    };
  },
  mutations: {
    setUserData(state, userData) {
      state.user = { ...state.user, ...userData };
    },
    CLEAR_USER_DATA(state) {
      state.user = {
        id: null,
        name: null,
        rol: null,
        email: null,
      };
    },
  },
  actions: {
    updateUserData(context, userData) {
      context.commit('setUserData', userData);
    },
    clearUserData({ commit }) {
      commit('CLEAR_USER_DATA');
    },
  },
  getters: {
    getUserData(state) {
      return state.user;
    },
  },
});

export default store;
