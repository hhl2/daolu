<template>
  <div class="roadlist_table">

    <div class="radar_box">
      <div class="info_box" :style="tableData_repeat[select_index]?.radarImg!=null?'width:55%;':'flex:1'">
        <el-descriptions
            class="margin-top"
            :data="tableData"
            :column="2"
            :size="size"
            :style="blockMargin"
        >

          <el-descriptions-item el-descriptions-item label="所在道路">{{ droad || '' }}</el-descriptions-item>
          <el-descriptions-item label="病害类型">{{ tableData[0]?.disasterType_dictText || '' }}</el-descriptions-item>

        </el-descriptions>

        <!-- 表格区域 -->
        <el-table
            class="custom-table"
            :data="tableData_repeat"
            border
            v-loading="loading"
            style="width: 100%;overflow-y:auto;"
            height="270">

          <el-table-column prop="follow_up_user_name" label="复测次数">
            <template #default="scope">
              第{{ (currentPage - 1) * pageSize + scope.$index + 1 }}次
            </template>
          </el-table-column>
          <el-table-column prop="square" label="面积(m²)"/>
          <el-table-column prop="depth" label="净深(m)"/>
          <el-table-column prop="sfthd" label="埋深(m)"/>


        </el-table>

      </div>
      <div style="margin-right:10px;"></div>
      <div style="max-width:370px;flex: 1;" v-show="tableData_repeat[select_index]?.radarImg!=null">
        <div class="roadsituation">
          <!--轮播区域-->
          <div class="swiper_box">
            <swiper
                :modules="modules"
                :slides-per-view="3"
                :space-between="10"
                navigation
                :pagination="{ clickable: true }"
                @swiper="onSwiper"
                @slideChange="onSlideChange"
            >
              <swiper-slide style="cursor:pointer;" v-for="item in tableData_repeat.length" :key="item"
                            @click="handlerepeatclick(item)" :style="{
            color: select_index === item-1 ? '#4488ff' : '',
        }">
                第{{ item }}次
              </swiper-slide>

            </swiper>
          </div>

          <div v-show="tableData_repeat[select_index]?.radarImg!=null" class="radar_class">
            <img :src="'https://www.roadradar.cn/dljcboot/sys/common/static/' + (tableData_repeat[select_index]?.radarImg || '')"
                 class="enlarge-image" style="max-width:100%;"/>


          </div>

        </div>
      </div>
    </div>

  </div>

</template>


<script setup>

import {onBeforeMount, onMounted, ref} from 'vue'
import {get_disease, get_disease_repeat} from '@/api/user'
import {Navigation} from 'swiper/modules'; // 必须导入模块 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css'; // 核心样式 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css/navigation'; // 导航按钮样式 :ml-citation{ref="3,8" data="citationList"}
const modules = [Navigation];                 // 模块配置 :ml-citation{ref="3,8" data="citationList"}


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

var tableData_repeat = ref([])
//复测数据
var select_index = ref(0);
const handlerepeatclick = (index) => {
  select_index.value = index - 1;
  console.log(index);
}

// 获取数据（真实API调用）
const fetchData = async () => {
  try {
    loading.value = true


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

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current

      get_disease_repeat({hiscode: res.result.records[0].disasterHiscode}).then(rr => {

        tableData_repeat.value = rr.result.records
        console.log('病害复测情况i:', rr.result.records)
      }).catch(err => {
        console.error('病害复测情况i请求失败1:', err)
      });
    }).catch(err => {
      console.error('病害基本信息请求失败1:', err)
    });


  } finally {
    loading.value = false
  }
}


// 初始化加载
onMounted(() => {
  fetchData();
});

var droad = ref('');
// beforeMount 阶段
onBeforeMount(() => {
  //1.获取本地存储值
  var diseasedata = localStorage.getItem('diseasetrack');

  // 2. 解析 JSON 数据（带错误处理）
  try {
    const diseaseinfo = diseasedata ? JSON.parse(diseasedata) : null;

    searchText.value = diseaseinfo.id;

    droad.value = localStorage.getItem('diseasetrack_road') ? JSON.parse(localStorage.getItem('diseasetrack_road')).id : null;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})
</script>
<style>
.swiper-wrapper {
  justify-content: space-evenly;
}
</style>

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

.radar_box {
  display: flex;
  justify-content: space-between;
}

.roadsituation .swiper_box {
  background-color: rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
}

.radar_class {
  background-color: rgba(255, 255, 255, 0.2);
}

</style>