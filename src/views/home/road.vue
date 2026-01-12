<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">道路信息</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <RoadInfo/>
        </el-tab-pane>
        <el-tab-pane label="风险等级" name="second">
          <RoadRisk/>
        </el-tab-pane>
        <el-tab-pane label="检测情况" name="third">
          <RoadSituation/>
        </el-tab-pane>
        <!-- <el-tab-pane label="空间分析" name="fourth"></el-tab-pane> -->
        <el-tab-pane label="病害详情" name="five">
          <RoadDisease/>
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
import RoadInfo from '@/components/RoadInfo.vue'
import RoadRisk from '@/components/RoadRisk.vue'
import RoadDisease from '@/components/RoadDisease.vue'
import RoadSituation from '@/components/RoadSituation.vue'

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

  //router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};
//选项卡
const activeName = ref('first')
const handleClick = (tab) => {
  console.log(tab.index)
  if (tab.index == 3) {
    //空间分析
    // ue5click(tab.index);
    // router.push('/');
  }
}

// /* 触发ue5 */
//   // 注入父组件提供的方法
//   const playerMethods = inject('playerMethods')
//   // 封装调用逻辑
//   const callParentMethod = (message) => {
//   if (playerMethods?.sendMessage) {
//       playerMethods.sendMessage(message)
//   } else {
//       console.error('方法未成功注入')
//   }
//   }
//   const ue5click= (index) => {
//       // 方法1：URI组件编码方案（兼容性好）
//       const encodedURI = encodeURIComponent(index)
//       .replace(/%([0-9A-F]{2})/g, (_, hex) =>
//       String.fromCharCode(parseInt(hex, 16))
//       );
//       console.log('点击触发一路一网空间分析',{"code":1,"type":"poi","data":{"id":btoa(encodedURI),"state":"kongjianfenxi"}});
//       callParentMethod({"code":1,"type":"poi","data":{"id":btoa(encodedURI),"state":"kongjianfenxi"}});
//   }
//   /* 触发ue5 */


</script>


