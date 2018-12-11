<template>
  <div class="page-column">
    <slot>PageColumn</slot>
  </div>
</template>

<script>
export default {
  name: "PageColumn",
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
.page-column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
