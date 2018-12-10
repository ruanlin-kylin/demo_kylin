<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div class="box" v-for="item in data" :key="item.date">
      <h5>{{item.title}}</h5>
      <span>{{item.date}}</span>
      <span>{{item.author_name}}</span>
      <img :src="item.thumbnail_pic_s" alt="">
    </div>
  </div>
</template>
<script>
export default {
  name: "about",
  data() {
    return {
      data: []
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.axios.post("/api/news").then(res => {
        this.data = res.data.articles;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.about {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .box {
    width: 33%;
  }
}
</style>
