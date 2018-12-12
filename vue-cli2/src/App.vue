<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  created () {
    this.init()
  },
  methods: {
    init () {
      this.onInterceptors()
    },
    onInterceptors () {
      // 请求之前拦截器
      axios.interceptors.request.use((config) => {
        // 请求之前做的事
        return config
      })
      // 响应之后拦截器
      axios.interceptors.response.use((response) => {
        // 对响应数据做点什么
        return response
      }, (e) => {
        // 对响应错误做点什么
        return Promise.reject(e)
      })
    }
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#app {
  height: 100%;
  display: flex;
}
</style>
