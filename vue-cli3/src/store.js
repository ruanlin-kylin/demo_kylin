import Vue from "vue";
import Vuex from "vuex";

import * as type from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    click: null,
    resize: null
  },
  getters: {
    onclick: state => state.click
  },
  mutations: {
    [type.SET_EVENT](state, event) {
      state[event.type] = event;
      event.type === "click" ? alert("I am a mutations API") : null;
    }
  },
  actions: {
    triggerEvent({ commit }, event) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit(type.SET_EVENT, event);
          resolve();
        }, 1000);
      });
    }
  }
});
