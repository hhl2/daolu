<template>
  <div class="roadlist_box zz_box">
    <div class="tc_box">
      <div class="tc_left">{{ disease || '' }}</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="雷达图谱" name="first">
          <KshRadar/>
        </el-tab-pane>
        <el-tab-pane label="变化曲线" name="second">
          <KshCurve/>
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

.zz_box {
  height: 400px;
}
</style>
<!-- HomeIndex.vue -->
<script>
export default {
  name: 'KeDiseaseTrackModel' // 改为多单词名称
}
</script>
<script setup>

import {ref, onBeforeMount} from 'vue'
import KshCurve from '@/components/KshCurve.vue'
import KshRadar from '@/components/KshRadar.vue'

import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
//接收参数
var userId = route.query.id
console.log('接收参数', userId);
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
if (userId == 1) {
  activeName.value = "second";
} else if (userId == 0) {
  activeName.value = "first";
}
const handleClick = (tab) => {
  console.log(tab.index)
}

var disease = ref('');
// beforeMount 阶段
onBeforeMount(() => {
  //1.获取本地存储值
  var diseasedata = localStorage.getItem('diseasetrack');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const diseaseinfo = diseasedata ? JSON.parse(diseasedata) : null;
    disease.value = diseaseinfo.id;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})

</script>


