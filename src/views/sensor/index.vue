<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">传感器在线实时监测平台</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="分布式光纤在线监测" name="first">
          <SensorFibre/>
        </el-tab-pane>
        <el-tab-pane label="INSAR监测" name="second">
          <SensorInsar/>
        </el-tab-pane>

      </el-tabs>
    </div>

  </div>
</template>

<script>
export default {
  name: 'SensorIndex',
}
</script>

<script setup>

import {inject, ref} from 'vue'
import SensorFibre from '@/components/SensorFibre.vue'
import SensorInsar from '@/components/SensorInsar.vue'

import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};

//点击病害编号触发ue
// 1. 直接注入 playerMethods
const playerMethods = inject('playerMethods')

const jiankongclick = (item) => {
  // 方法1：URI组件编码方案（兼容性好）
  // const encodedURI = encodeURIComponent(item)
  // .replace(/%([0-9A-F]{2})/g, (_, hex) =>
  // String.fromCharCode(parseInt(hex, 16))
  // );

  // btoa(encodedURI)
  console.log('点击传感器触发ue', {"code": 1, "type": 'poi', "data": {"id": item}});
  playerMethods.sendMessage({"code": 1, "type": 'poi', "data": {"id": item}})
}

//选项卡
const activeName = ref('first')
const handleClick = (tab) => {
  console.log(tab.index)
  if (tab.index == 0) {
    jiankongclick('fenbushi');
    //router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
  }
  if (tab.index == 1) {
    jiankongclick('insar');
  }
}

</script>