<template>
  <div class="roadlist_table">
    <!-- 搜索区域 -->
    <div class="serach_b">
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
    </div>
    <div class="sb">
      <div style="width:30%;" class="roadsituation">
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
            <swiper-slide v-for="item in tableData.length" :key="item" @click="handleClick(item)" :style="{
    color: select_index === item-1 ? '#4488ff' : '',
  }">
              第{{ item }}次
            </swiper-slide>

          </swiper>
        </div>

      </div>
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
        <el-descriptions-item label="检测次数">{{ tableData?.length || '' }}</el-descriptions-item>
        <el-descriptions-item label="待处置病害数量">{{
            tableData[select_index]?.needtofix || ''
          }}
        </el-descriptions-item>
        <el-descriptions-item label="时间">{{ tableData[select_index]?.surveyDate || '' }}</el-descriptions-item>
        <el-descriptions-item label="巡检中病害数量">{{
            tableData[select_index]?.xjnums || ''
          }}
        </el-descriptions-item>
        <el-descriptions-item label="发现病害的数量">{{ tableData[select_index]?.allbhnums || '' }}</el-descriptions-item>
<!--        <el-descriptions-item label="隐患排除率%">{{ getpcl(tableData[select_index])  }}</el-descriptions-item>-->
        <el-descriptions-item label="已处置病害数量">{{
            tableData[select_index]?.fixednums || ''
          }}
        </el-descriptions-item>
      </el-descriptions>

    </div>


  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import {get_road_jcqk} from '@/api/user'
import { Swiper, SwiperSlide } from 'swiper/vue';
import {Navigation} from 'swiper/modules'; // 必须导入模块 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css'; // 核心样式 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css/navigation'; // 导航按钮样式 :ml-citation{ref="3,8" data="citationList"}
const modules = [Navigation];                 // 模块配置 :ml-citation{ref="3,8" data="citationList"}

var select_index = ref(0);
const handleClick = (index) => {
  select_index.value = index - 1;
  console.log('点击了：' + select_index.value);
}

// 响应式数据
const searchText = ref('')
// const currentPage = ref(1)
// const pageSize = ref(1)
// const total = ref(0)
const tableData = ref([])
const loading = ref(false)
// const getpcl = (data)=>{
//   if(data.fixednums || data.allbhnums ){
//     return(data.fixednums/data.allbhnums).toFixed(2)*100;
//   }else{
//     return ''
//   }
// }
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

    //获取路网列表
    console.log('检测的道路',searchText.value);
    get_road_jcqk({roadName:searchText.value,current:1,pageSize:100}).then(res => {
      console.log('道路检测情况:', res)
      tableData.value = res.result.records
    }).catch(err => {
      console.error('请求失败1:', err)
    });


  } finally {
    loading.value = false
  }
}

// 搜索事件
const handleSearch = () => {
  // currentPage.value = 1  // 重置到第一页:ml-citation{ref="5" data="citationList"}
  fetchData()
}

// 分页事件
// const handleSizeChange = (newSize) => {
// pageSize.value = newSize
// fetchData()
// }

// const handleCurrentChange = (newPage) => {
// currentPage.value = newPage
// fetchData()
// }

// 初始化加载
onMounted(fetchData)

// beforeMount 阶段
onBeforeMount(() => {
  //1.获取本地存储值
  var roaddata = localStorage.getItem('roadinfo');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const roadinfo = roaddata ? JSON.parse(roaddata) : null;
    console.log('道路风险等级ID:', roadinfo.id);
    searchText.value = roadinfo.id;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})
</script>
