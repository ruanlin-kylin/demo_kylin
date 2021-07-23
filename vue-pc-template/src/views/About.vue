<template>
  <div>
    <h1>div拖动示例</h1>

    <ul class="box" ref="box">
      <li class="left" ref="left">西瓜</li>
      <li class="resize" ref="resize">按住我拖动</li>
      <li class="right" ref="right">番茄</li>
    </ul>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.dragControllerDiv();
    },
    methods: {
      dragControllerDiv: function() {
        let resize = document.getElementsByClassName("resize")[0];
        let left = document.getElementsByClassName("left")[0];
        let box = document.getElementsByClassName("box")[0];
        resize.onmousedown = function(e) {
          let startX = e.clientX;
          resize.left = resize.offsetLeft;
          document.onmousemove = function(e) {
            let endX = e.clientX;
            let moveLen = resize.left + (endX - startX);
            let maxT = box.clientWidth - resize.offsetWidth;
            if (moveLen < 150) moveLen = 150;
            if (moveLen > maxT - 150) moveLen = maxT - 150;
            left.style.width = moveLen + "px";
          };
          document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
            resize.releaseCapture && resize.releaseCapture();
          };
          resize.setCapture && resize.setCapture();
          return false;
        };
      }
    }
  };
</script>

<style lang="less" scoped>
  ul,
  li {
    list-style: none;
    display: block;
    margin: 0;
    padding: 0;
  }
  .box {
    width: 800px;
    height: 500px;
    overflow: hidden;
    display: flex;
    .left {
      width: 30%;
      height: 100%;
      background: skyblue;
    }

    .resize {
      width: 16px;
      height: 100%;
      cursor: w-resize;
      background-color: #333;
      margin: 0 3px;
      color: #fff;
    }

    .right {
      height: 100%;
      background: tomato;
      flex: 1;
    }
  }
</style>
