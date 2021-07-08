<template>
  <div>
    <h3>今天是{{ getCurrentWeek() }}，快乐工作的一周又开始了\(^o^)/~</h3>
    <div v-for="(value, key) in divHtml" :key="key">
      {{ `${key}: ${value}` }}
    </div>
  </div>
</template>

<script>
  import { reactive, onMounted, getCurrentInstance } from 'vue';
  import { getHospitalConfig } from '@/api';
  import { getCurrentWeek } from '@/utils/commom';
  export default {
    setup(props) {
      const divHtml = reactive({
        name: getCurrentWeek(),
        desc: '快乐工作的一天开始了',
      });

      function getInfo(params) {
        getHospitalConfig().then((res) => {
          Object.assign(divHtml, res.map);
        });
      }

      onMounted(() => {
        getInfo();
      });
      return {
        divHtml,
        getCurrentWeek,
      };
    },
  };
</script>
