<template>
  <div class="page-main">
    <slot>
      <HelloWorld></HelloWorld>
    </slot>
  </div>
</template>

<script>
import HelloWorld from "./HelloWorld";
export default {
  name: "PageMain",
  components: {
    HelloWorld
  },
  props: {
    msg: String
  },
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.page-main {
  display: flex;
  flex: 1;
  background: burlywood;
}
</style>
