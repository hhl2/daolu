<!-- 检测预案 -->
<template>
  <div class="roadlist_table">
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-input
          v-model="searchText"
          placeholder="请输入道路名称"
          clearable
          @keyup.enter="handleSearch"
          style="width: 300px; margin-right: 15px">
      </el-input>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
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
      <el-table-column prop="updateTime" label="待检测时间"
                       column-key="detectionTime"
                       :filters="[
                    { text: '立即检测', value: '1' },
                    { text: '6个月内检测', value: '2-3' },
                    { text: '12个月内检测', value: '4-5' }
                ]"
                       :filter-multiple="false"
      >
        <template #default="{ row }">
                    <span>
                    {{
                        row.riskLevel === '1' ? '立即检测' : (row.riskLevel === '2' ? '6个月内检测' : (row.riskLevel === '3' ? '6个月内检测' : '12个月内检测'))
                      }}
                    </span>
        </template>
      </el-table-column>
      <el-table-column prop="roadName" label="序号">
        <template #default="scope">
          {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="roadName" label="道路名称" show-overflow-tooltip="true">
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

      <el-table-column prop="riskLevel" label="风险等级"
                       column-key="riskLevel"
                       :filters="[
                { text: 'I', value: '1' },
                { text: 'II', value: '2' },
                { text: 'III', value: '3' },
                { text: 'IV', value: '4' },
                { text: 'V', value: '5' },
            ]"
                       :filter-multiple="false"
      >
        <template #default="{ row }">
                    <span :class="[
                        row.riskLevel === '1' ? 'risk-level-1' :
                        row.riskLevel === '2' ? 'risk-level-2' :
                        row.riskLevel === '3' ? 'risk-level-3' :
                        row.riskLevel >= '4' ? 'risk-level-4' : ''
                    ]">
                    {{ toRoman(row.riskLevel) }}
                    </span>
        </template>

      </el-table-column>
      <el-table-column prop="roadCsdlLevel_dictText" label="道路等级"/>
      <el-table-column prop="findBhtNum" label="往期病害数量" :formatter="(row) => row.findBhtNum || 0"/>
      <el-table-column prop="riskNum" label="未处置数量" :formatter="(row) => (row.findBhtNum - (row.fixedBhtNum || 0)) || 0"/>
      <!-- <el-table-column prop="follow_up_user_name" label="信息卡" >
          <template #default="scope">
          <a
              href="javascript:void(0)"
              @click="handleClick(scope.row.roadName)"
          >
              详情
          </a>
          </template>
      </el-table-column> -->
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

    <!-- 放大图片 -->
    <el-dialog @closed="handleDialogClose" v-model="dialogVisible" width="50%" style="text-align:center;">
      <router-view name="jc"></router-view>
    </el-dialog>
  </div>
</template>

<script setup>
import {inject, onMounted, ref, watch} from 'vue'
import {get_work} from '@/api/user'
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();

//点击图片放大弹窗
const dialogVisible = ref(false);
// 监听路由变化控制弹窗
watch(
    () => route.name,
    (newVal) => {
      dialogVisible.value = newVal === 'jc_modal' // 根据子路由激活状态控制弹窗
    },
    {immediate: true}
)
// 弹窗关闭时清理路由
const handleDialogClose = () => {
  router.push({name: 'severe'}) // 返回父路由
}
// const handleClick = (item) => {
//     localStorage.setItem('roadinfo', JSON.stringify({ id: item }))
//     router.push({
//         name: 'jc_modal', // 使用子路由名称
//         query: { id: item } // 可选参数
//     })
// }
//点击图片放大弹窗end

function toRoman(num) {
  const romanMap = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V'
  };
  return romanMap[num] || num;
}

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

//选择风险等级
var riskLevel = ref('');
const detectionTimeFilter = ref('')
const handleFilterChange = (filters) => {
  if (filters.riskLevel) {
    if (filters.riskLevel[0] == null) {
      riskLevel.value = '';
    } else {
      riskLevel.value = filters.riskLevel[0];
    }
    console.log('触发事件风险等级', riskLevel.value);
  }

  if (filters.detectionTime) {
    detectionTimeFilter.value = filters.detectionTime[0] || ''
    console.log('触发检测时间', detectionTimeFilter.value)

    // 当选择"6个月内检测"时，自动设置风险等级为2或3
    if (detectionTimeFilter.value === '2-3') {
      riskLevel.value = ['2', '3']
    }
    // 当选择"12个月内检测"时，自动设置风险等级为4或5
    else if (detectionTimeFilter.value === '4-5') {
      riskLevel.value = ['4', '5']
    }
    // 当选择"立即检测"时，自动设置风险等级为1
    else if (detectionTimeFilter.value === '1') {
      riskLevel.value = '1'
    } else {
      riskLevel.value = ''
    }
  }
  fetchData();
}

// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
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

    //获取路网列表
    get_work({
      current: currentPage.value,
      pagesize: pageSize.value,
      searchtext: searchText.value,
      riskLevel: riskLevel.value
    }).then(res => {
      console.log('道路列表:', res)

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
    }).catch(err => {
      console.error('请求失败1:', err)
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
