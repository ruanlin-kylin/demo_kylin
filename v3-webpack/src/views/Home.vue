<template>
  <a-layout class="components-layout-demo-custom-trigger">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img :src="logoSrc" alt="logo" />
      </div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys" @click="handleClick">
        <a-menu-item key="1">
          <user-outlined />
          <span>About</span>
        </a-menu-item>
        <a-menu-item key="2">
          <video-camera-outlined />
          <span>HelloKitty</span>
        </a-menu-item>
        <a-menu-item key="3">
          <upload-outlined />
          <span>others</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  } from '@ant-design/icons-vue';
  import { ref, reactive, toRefs, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { getHospitalConfig } from '@/api';
  export default {
    components: {
      UserOutlined,
      VideoCameraOutlined,
      UploadOutlined,
      MenuUnfoldOutlined,
      MenuFoldOutlined,
    },
    props: { msg: String },
    setup() {
      const collapsed = ref(false);
      const obj = reactive({ selectedKeys: ['1'] });
      const routeName = 'About';
      const router = useRouter();
      const logoSrc = computed(() => {
        let img_def = require('../assets/crm_logo.png');
        let img_small = require('../assets/crm_logo_small.png');

        return collapsed.value ? img_small : img_def;
      });

      function handleClick({ key }) {
        switch (key) {
          case '1':
            router.push({ name: 'About' });
            break;
          case '2':
            router.push({ name: 'HelloKitty' });
            break;
          case '3':
            router.push({ name: 'Others' });
            break;
          default:
            break;
        }
      }

      onMounted(() => {
        getHospitalConfig().then((data) => {
          console.log('onMounted', data);
        });
      });

      return {
        ...toRefs(obj),
        collapsed,
        logoSrc,
        routeName,
        handleClick,
      };
    },
  };
</script>
<style lang="less" scoped>
  .components-layout-demo-custom-trigger {
    height: 100%;
    width: 100%;
    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      margin: 16px;
      text-align: center;
    }
    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
  }
</style>
