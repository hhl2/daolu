<template>
  <div class="roadlist_table">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-input
          v-model="searchText"
          placeholder="输入关键词搜索"
          clearable
          @keyup.enter="handleSearch"
          style="width: 300px; margin-right: 15px">
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格区域 -->
    <div class="info_box">
      <el-descriptions
          class="margin-top"
          :data="tableData"
          :column="2"
          :size="size"
          :style="blockMargin"
      >
        <el-descriptions-item label="处置情况">{{
            (tableData[0]?.fix == 'Y' ? '已处置' : '未处置') || ''
          }}
        </el-descriptions-item>
        <el-descriptions-item label="处置时间">{{ tableData[0]?.fixDate || '' }}</el-descriptions-item>
        <el-descriptions-item label="处置方法">{{ tableData[0]?.fixType_dictText || '' }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ tableData[0]?.fixMan || '' }}</el-descriptions-item>
      </el-descriptions>

    </div>

    <!--轮播区域-->
    <div class="swiper_box">
      <swiper
          :modules="modules"
          :slides-per-view="3"
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


    <!-- 分页控件 -->
    <!-- <el-pagination style="margin-top:15px;"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        small
        :page-sizes="[10, 20, 30, 50]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    /> -->
  </div>
  <!-- 放大图片 -->
  <el-dialog v-model="dialogVisible" width="80%" style="text-align:center;">
    <img :src="currentImage" class="enlarge-image" style="max-width:100%;"/>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {get_disease} from '@/api/user'
import { Swiper, SwiperSlide } from 'swiper/vue';
import {Navigation} from 'swiper/modules'; // 必须导入模块 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css'; // 核心样式 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css/navigation'; // 导航按钮样式 :ml-citation{ref="3,8" data="citationList"}
const modules = [Navigation];                 // 模块配置 :ml-citation{ref="3,8" data="citationList"}


//轮播图
const banner = ref([]);
//点击图片放大弹窗
const dialogVisible = ref(false);
const currentImage = ref('');

const handleClick = (item) => {
  currentImage.value = item;
  dialogVisible.value = true;
}
//点击图片放大弹窗end

var riskLevel = ref('');
var disasterType = ref('');
var status_dictText = ref('');
const searchroad = ref('')

// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(1)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)

// 获取数据（真实API调用）
const fetchData = async () => {
  try {
    loading.value = true
    // const res = await axios.get('/data.Info/photovoltaicsInfo', {
    // params: {
    //     keyword: searchText.value,
    //     page: currentPage.value,
    //     size: pageSize.value
    // }
    // })

    // // //获取数据列表get
    //  {
    // name: searchText.value,  // 修改为接口需要的搜索参数名
    // page: currentPage.value,
    // size: pageSize.value
    // }

    banner.value = [];
    //获取路网列表
    get_disease({
      current: currentPage.value,
      pagesize: pageSize.value,
      searchtext: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status_dictText: status_dictText.value,
      roadName: searchroad.value
    }).then(res => {
      console.log('病害基本信息:', res)
      if (res.result.records[0].dingweiImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].dingweiImg);
      }

      if (res.result.records[0].radarImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].radarImg);
      }
      if (res.result.records[0].xianchangImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].xianchangImg);
      }
      /*if(res.result.records[0].zuankongImg !=null){
          banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/'+res.result.records[0].zuankongImg);
      }*/

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
      console.log(banner.value);
    }).catch(err => {
      console.error('病害基本信息请求失败1:', err)
    });


  } finally {
    loading.value = false
  }
}

// 搜索事件
const handleSearch = () => {
  currentPage.value = 1  // 重置到第一页:ml-citation{ref="5" data="citationList"}
  fetchData()
}

// 分页事件
/*const handleSizeChange = (newSize) => {
pageSize.value = newSize
fetchData()
}

const handleCurrentChange = (newPage) => {
currentPage.value = newPage
fetchData()
}*/

// 初始化加载
onMounted(fetchData)

// beforeMount 阶段
onBeforeMount(() => {
  //1.获取本地存储值
  var diseasedata = localStorage.getItem('diseaseinfo');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const diseaseinfo = diseasedata ? JSON.parse(diseasedata) : null;

    searchText.value = diseaseinfo.id;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: transparent;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: transparent;
}


</style>