import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import user from './modules/user'
import getters from './getters'
import VuexPersistence from 'vuex-persist'
import * as Cookies from "js-cookie"

Vue.use(Vuex)
const vuexStorage = new VuexPersistence({
  key: 'CUED',
  storage: window.localStorage,
  // reducer: (state) => ({ book: book }), //only save navigation module
  // // filter: (mutation) => mutation.type == 'addNavItem'
  modules: ['book']
})
const vuexCookie = new VuexPersistence({
  key: 'CURD',
  storage: Cookies,
  restoreState: (key, storage) => Cookies.getJSON(key),
  saveState: (key, state, storage) =>
    Cookies.set(key, state, {
      expires: 7
    }),
  modules: ['user']
})

export default new Vuex.Store({
  modules: {
    book,
    user
  },
  getters,
  plugins: [vuexCookie.plugin, vuexStorage.plugin]
})
