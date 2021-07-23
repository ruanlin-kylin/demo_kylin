<template>
  <div class="home">
    <HelloWorld msg="Vue2开发模板" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import HelloWorld from "@/components/HelloWorld.vue";

  export default {
    name: "home",
    components: {
      HelloWorld
    }
  };
</script>

<style lang="less">
  .home {
    height: 100%;
  }
</style>
