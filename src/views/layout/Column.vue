<template>
  <div class="page-column">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'PageColumn',
  created () {
    this.axios.get('/combine/templates/imageCode/getCode').then(response => {

    })
  }
}
</script>

<style lang="scss" scoped>
.page-column {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
}
</style>
