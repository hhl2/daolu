<!--实时监控-->
<template>
  <div class="roadlist_table" style="margin-top:40px;">
      <el-image
            :src="banner"
            fit="cover"
      />

  </div>
</template>

<script setup>
import {ref} from 'vue'
import a1 from '@/assets/gxjc.png';
//轮播图
const banner = ref(a1);
</script>
    