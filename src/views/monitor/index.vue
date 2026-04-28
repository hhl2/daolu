<!--监控指挥-->
<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">监控指挥</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold />
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="车辆监控" name="first">
          <MonitorJk />
        </el-tab-pane>
        <el-tab-pane label="城市监控" name="second">
          <MonitorCity />
        </el-tab-pane>
        <el-tab-pane label="数据回溯" name="third">
          <MonitorHs />
        </el-tab-pane>
        <el-tab-pane label="实时巡检" name="four">
          <MonitorXj />
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>
<style>
.demo-tabs>.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

/* 强制禁用状态的选项卡文字变灰 */
.road_tab .el-tabs__item.is-disabled {
  color: #a8abb2 !important;
  /* 置灰的颜色 */
  cursor: not-allowed !important;
}
</style>

<!-- HomeIndex.vue -->
<script>
export default {
  name: 'MonitorIndex',
  inject: ['playerMethods'], // 注入方法
  mounted() { // 组件挂载后自动执行
    // console.log('adfdfa');
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

import { inject, ref } from 'vue'
import MonitorJk from '@/components/MonitorJk.vue'
import MonitorHs from '@/components/MonitorHs.vue'
import MonitorXj from '@/components/MonitorXj.vue'
import MonitorCity from '@/components/MonitorCity.vue'

import { useRouter } from 'vue-router';

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
  console.log('点击城市监控/数据回溯触发ue', { "code": 1, "type": 'poi', "data": { "id": item } });
  playerMethods.sendMessage({ "code": 1, "type": 'poi', "data": { "id": item } })
}

//选项卡
const activeName = ref('first')
const handleClick = (tab) => {
  console.log(tab.index)
  if (tab.index == 0) {
    jiankongclick('cljk');
    //router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
  }
  if (tab.index == 1) {
    jiankongclick('csjk');
    router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
  }

  if (tab.index == 2) {
    jiankongclick('sjhs');
    router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
  }

  if (tab.index == 3) {
    jiankongclick('ssxj');
    router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
  }
}

</script>
