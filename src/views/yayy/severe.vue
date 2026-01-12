<!--预案-->
<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">预案</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div class="road_tab">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="检测预案" name="first">
          <YayyDetection/>
        </el-tab-pane>
        <el-tab-pane label="处置预案" name="second">
          <YayyDispose/>
        </el-tab-pane>
        <el-tab-pane label="巡查预案" name="third">
          <YayyPatrol/>
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
<script>
export default {
  name: 'YayySevere' // 改为多单词名称
}
</script>

<script setup>

import {ref} from 'vue'
import YayyDetection from '@/components/YayyDetection.vue'
import YayyDispose from '@/components/YayyDispose.vue'
import YayyPatrol from '@/components/YayyPatrol.vue'

import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};
//选项卡
const activeName = ref('first')
const handleClick = (tab) => {
  console.log(tab.index)
}

</script>