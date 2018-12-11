<template>
  <div class="hello">
    <div v-for="item in userData" :key="item.id">
      <a>{{item.name}}</a>
    </div>
    <el-button @click="gohome">gohome</el-button>
    <el-button @click="goabout">goabout</el-button>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data() {
    return {
      userData: []
    };
  },
  created() {
    this.axios.get("/api/user").then(res => {
      this.userData = res.data.list;
    });
  },
  methods: {
    gohome() {
      this.$router.push("/home");
    },
    goabout() {
      this.$router.push("/about");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
