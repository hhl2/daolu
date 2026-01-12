<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">预演</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="病害预演" name="first">
          <YyDisease/>
        </el-tab-pane>
        <el-tab-pane label="道路预演" name="second">
          <YyRoad/>
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
  name: 'YyGl',
}

</script>

<script setup>

import {ref} from 'vue'
import YyDisease from '@/components/YyDisease.vue'
import YyRoad from '@/components/YyRoad.vue'

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
  //道路预演
  if (tab.index == 1) {
    // disastercodeclick(421,'daolu');
    // router.push('/');
  }

}

//点击病害编号触发ue
// 1. 直接注入 playerMethods
// const playerMethods = inject('playerMethods')

// const disastercodeclick = (item,type) => {
//     // 方法1：URI组件编码方案（兼容性好）
//     const encodedURI = encodeURIComponent(item)
//     .replace(/%([0-9A-F]{2})/g, (_, hex) =>
//     String.fromCharCode(parseInt(hex, 16))
//     );
//     console.log('点击病害编号/点击道路预演触发ue',{"code":1,"type":'poi',"data":{"id":btoa(encodedURI),"state":type}});
//     playerMethods.sendMessage({"code":1,"type":'poi',"data":{"id":btoa(encodedURI),"state":type}})
// }

</script>


