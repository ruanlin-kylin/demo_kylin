import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import qs from "qs";
import moment from "moment";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.less";
import utils from "@/common/utils";
import axios from "axios";
import VueAxios from "vue-axios";
import XEUtils from "xe-utils";
import VXEUtils from "vxe-utils";

Vue.use(Antd);
Vue.use(VueAxios, axios);
Vue.use(VXEUtils, XEUtils);
XEUtils.mixin(utils);

Vue.config.productionTip = false;

axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
Vue.prototype.$message.config({
  top: `40px`,
  maxCount: 1
});
Vue.prototype.$notification.config({
  placement: "bottomRight",
  bottom: "50px",
  duration: 3
});
Vue.prototype.$qs = qs;
Vue.prototype.$moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
