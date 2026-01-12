<!--实时监控-->
<template>
  <div class="roadlist_table" style="margin-top:80px;">

    <!--轮播区域-->
    <div class="swiper_box sensor" style="max-height:300px;">
      <swiper
          :modules="modules"
          :slides-per-view="2"
          :space-between="50"
          navigation
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
      >
        <swiper-slide v-for="item in banner" :key="item" @click="handleClick(item)">
          <el-image
              :src="item"
              fit="cover"
          />
        </swiper-slide>

      </swiper>
    </div>

  </div>

  <!-- 放大图片 -->
  <el-dialog v-model="dialogVisible" width="80%" style="text-align:center;">
    <img :src="currentImage" class="enlarge-image" style="width:600px;"/>
  </el-dialog>
</template>

<style scoped>
  .swiper_box ::v-deep img {
      height: 300px;
  }
</style>

<script setup>
  import {ref} from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import {Navigation} from 'swiper/modules'; // 必须导入模块 :ml-citation{ref="3,8" data="citationList"}
  import 'swiper/css'; // 核心样式 :ml-citation{ref="3,8" data="citationList"}
  import 'swiper/css/navigation'; // 导航按钮样式 :ml-citation{ref="3,8" data="citationList"}
  const modules = [Navigation];                 // 模块配置 :ml-citation{ref="3,8" data="citationList"}

  import a1 from '@/assets/1.jpg';
  import a2 from '@/assets/2.jpg';
  import a3 from '@/assets/3.jpg';
  import a4 from '@/assets/4.jpg';

  //轮播图
  const banner = ref([a1,a2,a3,a4]);
  //点击图片放大弹窗
  const dialogVisible = ref(false);
  const currentImage = ref('');

  const handleClick = (item) => {
    currentImage.value = item;
    dialogVisible.value = true;
  }

  //点击图片放大弹窗end
</script>
    