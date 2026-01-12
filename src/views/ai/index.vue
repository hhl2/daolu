<!--ai-->
<script>
export default {
  name: 'AiIndex' // 改为多单词名称
}
</script>
<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">人工智能</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div style="padding:20px;">
      <img src="@/assets/ai_jpg.png" width="100%" height="500"/>
      <!-- <iframe src="https://www.baidu.com/" width="100%" height="500"></iframe> -->
    </div>
  </div>
</template>
<style>

</style>
<script setup>
//   import { ref } from 'vue'
import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};

</script>