<template>
  <div class="page-header">
    <slot>
      header
    </slot>
  </div>
</template>

<script>
export default {
  name: "PageHeader",
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
.page-header {
  display: flex;
  width: 100%;
  height: 100px;
  background: green;
}
</style>
