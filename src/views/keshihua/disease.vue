<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">病害</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <KshDiseaseinfo/>
        </el-tab-pane>
        <el-tab-pane label="处置情况" name="second">
          <KshDiseasedispose/>
        </el-tab-pane>
        <el-tab-pane label="复测情况" name="third">
          <KshDiseaseretest/>
        </el-tab-pane>

      </el-tabs>
    </div>

  </div>
</template>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>


<!-- HomeIndex.vue -->
<script>
export default {
  name: 'HomeRoad',
  inject: ['playerMethods'], // 注入方法
  mounted() { // 组件挂载后自动执行
    console.log('adfdfa');
    // this.callParentMethod('路网')
  },
  methods: {
    callParentMethod(message) {
      if (this.playerMethods?.sendMessage) {
        this.playerMethods.sendMessage(message);
      } else {
        console.error('方法未成功注入');
      }
    }
  },
}

</script>

<script setup>

import {ref} from 'vue'
import KshDiseaseinfo from '@/components/KshDiseaseinfo.vue'
import KshDiseasedispose from '@/components/KshDiseasedispose.vue'
import KshDiseaseretest from '@/components/KshDiseaseretest.vue'

import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const goToHome = () => {
  const matched = route.matched;
  if (matched.length > 1) {
    const parentRoute = matched[matched.length - 2];
    router.push(parentRoute.path);
  } else {
    router.push('/');
  }
};
//选项卡
const activeName = ref('first')
const handleClick = (tab) => {
  console.log(tab.index)
}

</script>


