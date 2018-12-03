<template>
  <div class="hello">
    <el-button @click="SET_EVENT">点我</el-button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {};
  },
  created() {
    window.onresize = this.SET_EVENT;
  },
  methods: {
    ...mapMutations(["SET_EVENT"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
