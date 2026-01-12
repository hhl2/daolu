<!--病害追踪-->
<template>
  <div class="roadlist_box zz_box" v-if="showParent">
    <div class="tc_box">
      <div class="tc_left">病害追踪</div>
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
            v-model="searchText"
            placeholder="请输入病害编号"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px; margin-right: 15px">
        </el-input>
        <el-input
            v-model="searchroad"
            placeholder="请输入道路名称"
            clearable
            @keyup.enter="handleSearch"
            style="width: 200px; margin-right: 15px">
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 表格区域 -->
      <el-table
          :data="tableData"
          border
          v-loading="loading"
          style="width: 100%"
          height="240"
          @filter-change="handleFilterChange"
      >
        <el-table-column prop="follow_up_user_name" label="序号" width="50">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="disasterCode" label="病害编号" show-overflow-tooltip="true">
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a
                href="javascript:void(0)"
                @click="disastercodeclick(scope.row.disasterCode,'binghai')"
            >
              {{ scope.row.disasterCode }}
            </a>
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
        <el-table-column prop="reportDate" label="上报日期">

        </el-table-column>

        <el-table-column prop="disasterType_dictText" label="病害类型"
                         column-key="disasterType_dictText"
                         :filters="[
                    { text: '空洞', value: 'kd' },
                    { text: '脱空', value: 'tk' },
                    { text: '严重疏松体', value: 'sstyz' },
                    { text: '一般疏松体', value: 'sstyb' },
                    { text: '富水体', value: 'fst' },
                ]"
                         :filter-multiple="false"
        />
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
                            row.riskLevel === '1' ? 'risk-level-4' :
                            row.riskLevel === '2' ? 'risk-level-3' :
                            row.riskLevel === '3' ? 'risk-level-2' :
                            row.riskLevel >= '4' ? 'risk-level-1' : ''
                        ]">
                        {{  row.riskLevel_dictText }}
                        </span>
          </template>

        </el-table-column>
        <el-table-column prop="status_dictText" label="状态"
                         column-key="status_dictText"
                         :filters="[ 
                    { text: '已治理', value: 'zl' }, 
                    { text: '未治理', value: 'wzl' },
                ]"
                         :filter-multiple="false"
        />
        <el-table-column prop="follow_up_user_name" label="复测情况">
          <template #default="{ row }">
                    <span v-if="repeatData[row.disasterHiscode] !== undefined">
                    {{ repeatData[row.disasterHiscode] }}
                    </span>
          </template>
        </el-table-column>
        <el-table-column prop="follow_up_user_name" label="雷达图谱">
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a
                href="javascript:void(0)"
                @click="handleClick(scope.row.disasterCode,scope.row.roadName,0)"
            >
              详情
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="follow_up_user_name" label="变化趋势">
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a
                href="javascript:void(0)"
                @click="handleClick(scope.row.disasterCode,scope.row.roadName,1)"
            >
              详情
            </a>
          </template>
        </el-table-column>
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
.zz_box {
  height: 400px;
}
</style>
<script>
export default {
  name: 'KeDiseaseTrack' // 改为多单词名称
}
</script>
<script setup>
import {inject, ref, onMounted, reactive, watch} from 'vue'
import {get_disease, get_disease_repeat} from '@/api/user'
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
      dialogVisible.value = newVal === 'diseasetrack_modal' // 根据子路由激活状态控制弹窗
    },
    {immediate: true}
)
// 弹窗关闭时清理路由
const handleDialogClose = () => {
  router.push({name: 'diseasetrack'}) // 返回父路由
}
const handleClick = (item, item_road, index) => { 
  localStorage.setItem('diseasetrack', JSON.stringify({id: item}))
  localStorage.setItem('diseasetrack_road', JSON.stringify({id: item_road}))
  router.push({
    name: 'diseasetrack_modal', // 使用子路由名称
    query: {id: index} // 可选参数
  })
}

//点击图片放大弹窗end 

//选择风险等级
var riskLevel = ref('');
var disasterType = ref('');
var status = ref('');
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

  fetchData();
}

// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
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
    //获取路网列表
    get_disease({
      current: currentPage.value,
      pagesize: pageSize.value,
      searchtext: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status: status.value,
      roadName: searchroad.value
    }).then(res => {
      console.log('病害列表:', res)

      tableData.value = res.result.records
      total.value = res.result.total
    }).catch(err => {
      console.error('病害请求失败1:', err)
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

//查询复测情况
// 响应式数据存储
const repeatData = reactive({})
const repeat_dis = async (hiscode) => {
  if (repeatData[hiscode]) return

  try {
    //获取路网列表
    get_disease_repeat({hiscode: hiscode}).then(res => {
      // console.log('道路病害复测情况:', res)
      repeatData[hiscode] = res.result.total
    }).catch(err => {
      console.error('道路病害复测情况请求失败1:', err)
    });


  } catch (err) {
    console.error('获取 失败:', err)
  }
}
// 自动触发加载逻辑
watch(() => tableData.value, (newVal) => {
  newVal.forEach(row => {
    repeat_dis(row.disasterHiscode)
  })
}, {immediate: true})
//查询复测情况end

// 初始化加载
onMounted(fetchData)
</script>