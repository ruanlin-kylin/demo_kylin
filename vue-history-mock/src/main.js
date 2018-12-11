import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import axios from "axios";
import VueAxios from "vue-axios";
import "./plugins/element.js";
import "./mock/mock.js";

import PageAside from "./components/Aside.vue";
import PageHeader from "./components/Header.vue";
import PageMain from "./components/Main.vue";
import PageFooter from "./components/Footer.vue";
import PageRow from "./components/Row.vue";
import PageColumn from "./components/Column.vue";

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

Vue.component(PageAside.name, PageAside);
Vue.component(PageHeader.name, PageHeader);
Vue.component(PageMain.name, PageMain);
Vue.component(PageFooter.name, PageFooter);
Vue.component(PageRow.name, PageRow);
Vue.component(PageColumn.name, PageColumn);

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
