<!--塌陷列表-->
<template>
  <div class="roadlist_box" v-if="showParent">
    <div class="tc_box">
      <div class="tc_left">塌陷列表</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    
    <div class="roadlist_table">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input
            v-model="searchroad"
            placeholder="请输入道路名称"
            clearable
            @keyup.enter="handleSearch"
            style="width: 400px; margin-right: 15px">
        </el-input>

        <el-image
          :src="require('@/assets/sousuo.png')" @click="handleSearch" style="margin-right:10px;cursor:pointer;">
        </el-image>

        <!-- <el-image
          :src="require('@/assets/dingwei.png')" @click="handleMap" style="margin-right:10px;cursor:pointer;">
        </el-image> -->

        <!-- <el-image
          :src="require('@/assets/xiazai.png')"  style="margin-right:10px;cursor:pointer;">
        </el-image> -->
        <!-- <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleMap">地图</el-button> -->

    
      </div>

      <!-- 表格区域 -->
      <el-table
          :data="tableData"
          border
          v-loading="loading"
          style="width: 100%"
          height="430"
          @filter-change="handleFilterChange"
      >
        <el-table-column prop="follow_up_user_name" label="序号" width="50">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        
        <el-table-column prop="roadName" label="所在道路" show-overflow-tooltip="true">
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a
                href="javascript:void(0)"
                @click="disastercodeclick(scope.row.roadName,'daolu')"
            >
              {{ scope.row.roadName }}
            </a>
          </template>

        </el-table-column>
        <el-table-column prop="address" label="位置" show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="happenDate" label="发生日期" ></el-table-column>
        <el-table-column prop="reason" label="引发原因" ></el-table-column>
        <el-table-column prop="injurynum" label="受伤人数" ></el-table-column>
        <el-table-column prop="deadnum" label="死亡人数" ></el-table-column>
        <el-table-column prop="propertylose" label="财产损失" ></el-table-column>
        <el-table-column prop="square" label="事故面积" ></el-table-column>
        <el-table-column prop="capacity" label="事故体积" ></el-table-column>
        <el-table-column prop="fixDate" label="处置完成时间" show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="fixMan" label="处置人" ></el-table-column>
        
      </el-table>


      <!-- 分页控件 -->
      <el-pagination style="margin-top:15px;"
                     v-model:current-page="currentPage"
                     v-model:page-size="pageSize"
                     small
                     :pager-count="4"
                     :page-sizes="[10, 20, 30, 50]"
                     :background="true"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
      />
    </div>

    <!-- 放大图片 -->
    <el-dialog @closed="handleDialogClose" v-model="dialogVisible" width="50%" style="text-align:center;">
      <router-view name="disease"></router-view>
    </el-dialog>
  </div>

  <router-view v-else name="disease"/>

</template>
<style>
.binghai_tab .el-tabs__header {
  margin-bottom: 0px;
}

.binghai_tab .el-tabs__item {
  color: #838383;
}

.binghai_tab .el-tabs__nav-wrap:after {
  background-color: #838383;
}

/* 禁用所有tab标签页的点击 */
.binghai_tab .el-tabs__item {
  pointer-events: none !important;
}
</style>
<script>
export default {
  name: 'KeDiseaseList',
  inject: ['playerMethods'], // 注入方法
  mounted() { // 组件挂载后自动执行
    // this.callParentMethod('告知UE去到指定')
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
import {inject, ref, onMounted,  watch} from 'vue'
import {get_collpse} from '@/api/user'
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};

const showParent = ref(true)
watch(() => route.meta?.hideParent, (shouldHide) => {
  showParent.value = !shouldHide
})

//动态年份
// const currentYear = new Date().getFullYear()
// const yearFilters = ref(
//   Array.from({ length: 5 }, (_, i) => ({
//     text: `${currentYear - 4 + i}`,
//     value: currentYear - 4 + i
//   }))
// )

//点击病害编号触发ue
// 1. 直接注入 playerMethods
const playerMethods = inject('playerMethods')

const disastercodeclick = (item, type) => {
  // 方法1：URI组件编码方案（兼容性好）
  const encodedURI = encodeURIComponent(item)
      .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
      );
  console.log('点击病害编号/道路名称触发ue', {
    "code": 1,
    "type": 'poi',
    "data": {"id": btoa(encodedURI), "state": type}
  });
  playerMethods.sendMessage({"code": 1, "type": 'poi', "data": {"id": btoa(encodedURI), "state": type}})
}

//点击图片放大弹窗
const dialogVisible = ref(false);
// 监听路由变化控制弹窗
watch(
    () => route.name,
    (newVal) => {
      dialogVisible.value = newVal === 'disease_modal' // 根据子路由激活状态控制弹窗
    },
    {immediate: true}
)
// 弹窗关闭时清理路由
const handleDialogClose = () => {
  router.push({name: 'diseaselist'}) // 返回父路由
}
// const handleClick = (item) => {
//   localStorage.setItem('diseaseinfo', JSON.stringify({id: item}))
//   router.push({
//     name: 'disease_modal', // 使用子路由名称
//     query: {id: item} // 可选参数
//   })
// }

//点击图片放大弹窗end

 

//选择风险等级
var riskLevel = ref('');
var disasterType = ref('');
var status = ref('');

var findDate = ref('');

const handleFilterChange = (filters) => {


  if (filters.disasterType_dictText) {
    if (filters.disasterType_dictText[0] == null) {
      disasterType.value = '';
    } else {
      disasterType.value = filters.disasterType_dictText[0];
    }
    console.log('触发事件病害类型', disasterType.value);
  }
  if (filters.riskLevel) {
    if (filters.riskLevel[0] == null) {
      riskLevel.value = '';
    } else {
      riskLevel.value = filters.riskLevel[0];
    }
    console.log('触发事件风险等级', riskLevel.value);
  }
  if (filters.status_dictText) {
    if (filters.status_dictText[0] == null) {
      status.value = '';
    } else {
      status.value = filters.status_dictText[0];
    }
    console.log('触发事件病害状态', status.value);
  }

  if (filters.findDate) {
    if (filters.findDate[0] == null) {
      findDate.value = '';
    } else {
      findDate.value = filters.findDate[0];
    }
    console.log('触发事件检测日期', findDate.value);
  }

  fetchData();
}


// 响应式数据
 const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)
const searchroad = ref('')


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
    //获取塌陷列表
    get_collpse({
      current: currentPage.value,
      pagesize: pageSize.value,  
      roadName: searchroad.value, 
    }).then(res => {
      console.log('塌陷列表:', res)

      tableData.value = res.result.records
      total.value = res.result.total
    }).catch(err => {
      console.error('塌陷请求失败1:', err)
    });

  } finally {
    loading.value = false
  }
}

//点击地图
// const handleMap = () => {

//   // 方法1：URI组件编码方案（兼容性好）
//   const encodedURI = encodeURIComponent(searchroad.value)
//       .replace(/%([0-9A-F]{2})/g, (_, hex) =>
//           String.fromCharCode(parseInt(hex, 16))
//       );
//   console.log('点击地图触发UE', {
//     "code": 1,
//     "type": 'poi',
//     "data": {
//       disasterCode: searchText.value,
//       riskLevel: riskLevel.value,
//       disasterType: disasterType.value,
//       status: status.value,
//       roadName: btoa(encodedURI),
//       years:findDate.value,
//       state:'map'
//     }
//   });
//   playerMethods.sendMessage({
//     "code": 1,
//     "type": 'poi',
//     "data": {
//       disasterCode: searchText.value,
//       riskLevel: riskLevel.value,
//       disasterType: disasterType.value,
//       status: status.value,
//       roadName: btoa(encodedURI),
//       years:findDate.value,
//       state:'map'
//     }
//   })

// }

// 搜索事件
const handleSearch = () => {
  currentPage.value = 1  // 重置到第一页:ml-citation{ref="5" data="citationList"}
  fetchData()
}

// 分页事件
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchData()
}
 

// 初始化加载
onMounted(fetchData)
</script>