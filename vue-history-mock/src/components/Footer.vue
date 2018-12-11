<template>
  <div class="page-footer">
    <slot>
      footer
    </slot>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
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
.page-footer {
  display: flex;
  width: 100%;
  height: 100px;
  background: blueviolet;
}
</style>
