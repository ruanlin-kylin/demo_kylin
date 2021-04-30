<template>
  <div id="app">
    <div>
      <p>
        If Element is successfully added to this project, you'll see an
        <code v-text="'<el-button>'"></code>
        below
      </p>
      <el-button @click="toUser">Go To User</el-button>
      <el-button @click="toCustomer">Go To Customer</el-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <!-- 基础用法 -->
    <v-icon name="beer" />
    <!-- 添加选项 -->
    <v-icon name="sync" scale="2" spin />
    <v-icon name="comment" flip="horizontal" />
    <v-icon name="code-branch" label="Forked Repository" />

    <!-- 堆叠图标 -->
    <v-icon label="No Photos">
      <v-icon name="camera" />
      <v-icon name="ban" scale="2" class="alert" />
    </v-icon>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "app",
  components: {
    HelloWorld
  },
  data() {
    return {};
  },
  methods: {
    toUser() {
      window.location.assign("../user/login.html");
    },
    toCustomer() {
      window.location.assign("../customer/home.html");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
