/*
 * @Author: ruanlin
 * @Descripttion:  基于axios进行 简单的业务封装
 */
import axios from 'axios';
import qs from 'qs';
import { message } from 'ant-design-vue';

/**
 * @Author: ruanlin
 * @Descripttion: code处理
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case 401:
      message.error(msg || '登录失效');
      break;
    default:
      message.error(msg || `后端接口${code}异常`);
      break;
  }
};

/**
 * @Author: ruanlin
 * @Descripttion: axios 初始化
 */
const instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: '10000',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
});

/**
 * @Author: ruanlin
 * @Descripttion: axios 请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    if (
      config.data &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8'
    )
      config.data = qs.stringify(config.data);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * @Author: ruanlin
 * @Descripttion: axios 响应拦截器
 */
instance.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    const { result, resultMsg } = data;
    let code = 999;
    if (result === 'SUCCESS') code = 200;
    // 操作正常Code数组
    const codeVerificationArray = [200, 0];
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data;
    } else {
      handleCode(code, resultMsg);
      return Promise.reject(
        '请求异常拦截:' + JSON.stringify({ url: config.url, code, resultMsg }) || 'Error'
      );
    }
  },
  (error) => {
    const { response, message } = error;
    if (error.response && error.response.data) {
      const { status, data } = response;
      handleCode(status, data.resultMsg || message);
      return Promise.reject(error);
    } else {
      let { message } = error;
      if (message === 'Network Error') {
        message = '后端接口连接异常';
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时';
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3);
        message = '后端接口' + code + '异常';
      }
      message.error(message || `后端接口未知异常`);
      return Promise.reject(error);
    }
  }
);

export default instance;
