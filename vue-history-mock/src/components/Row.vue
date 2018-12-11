<template>
  <div class="page-row">
    <slot>
      PageRow
    </slot>
  </div>
</template>

<script>
export default {
  name: "PageRow",
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
.page-row {
  display: flex;
  flex-grow: 1;
}
</style>
