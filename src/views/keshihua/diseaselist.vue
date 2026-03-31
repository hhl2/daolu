<!--病害列表-->
<template>
  <div class="roadlist_box" v-if="showParent">
    <div class="tc_box">
      <div class="tc_left">病害列表</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold />
        </el-icon>
      </div>
    </div>

    <div class="roadlist_table">
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-input v-model="searchText" placeholder="请输入病害病号" clearable @keyup.enter="handleSearch"
          style="width: 200px; margin-right: 15px">
        </el-input>

        <el-input v-model="searchroad" placeholder="请输入道路名称" clearable @keyup.enter="handleSearch"
          style="width: 200px; margin-right: 15px">
        </el-input>

        <el-image :src="require('@/assets/sousuo.png')" @click="handleSearch" style="margin-right:10px;cursor:pointer;">
        </el-image>

        <el-image :src="require('@/assets/dingwei.png')" @click="handleMap" style="margin-right:10px;cursor:pointer;">
        </el-image>

        <el-image :src="require('@/assets/xiazai.png')" style="margin-right:10px;cursor:pointer;"
          @click="downloadExcel">
        </el-image>
        <!-- <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="handleMap">地图</el-button> -->

        <div class="road_tab binghai_tab">
          <el-tabs v-model="activeName" class="demo-tabs">
            <el-tab-pane label="基本信息" name="first">
            </el-tab-pane>
            <el-tab-pane label="处置情况" name="second">
            </el-tab-pane>
            <el-tab-pane label="复测情况" name="third">
            </el-tab-pane>

          </el-tabs>
        </div>
      </div>

      <!-- 表格区域 -->
      <el-table :data="tableData" border v-loading="loading" style="width: 100%" height="430"
        @filter-change="handleFilterChange">
        <el-table-column prop="follow_up_user_name" label="序号" width="50">
          <template #default="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="disasterCode" label="病害编号" show-overflow-tooltip>
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a href="javascript:void(0)"
              @click="disastercodeclick(scope.row.disasterCode, 'binghai'), handleClick(scope.row.disasterCode)">
              {{ scope.row.disasterCode }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="roadName" label="所在道路" show-overflow-tooltip column-key="roadName" :filters="roadFilters"
          :filter-multiple="false">
          <template #default="scope">
            <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
            <a href="javascript:void(0)" @click="disastercodeclick(scope.row.roadName, 'daolu')">
              {{ scope.row.roadName }}
            </a>
          </template>

        </el-table-column>
        <el-table-column prop="findDate" label="检测时间" column-key="findDate" :filters="yearFilters"
          :filter-multiple="false">

        </el-table-column>

        <el-table-column prop="disasterType_dictText" label="病害类型" column-key="disasterType_dictText" :filters="[
          { text: '空洞', value: 'kd' },
          { text: '脱空', value: 'tk' },
          { text: '严重疏松体', value: 'sstyz' },
          { text: '一般疏松体', value: 'sstyb' },
          { text: '富水体', value: 'fst' },
        ]" :filter-multiple="false"> </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级" column-key="riskLevel" :filters="[
          { text: 'I', value: '1' },
          { text: 'II', value: '2' },
          { text: 'III', value: '3' },
          { text: 'IV', value: '4' },
          { text: 'V', value: '5' },
        ]" :filter-multiple="false">
          <template #default="{ row }">
            <span :class="[
              row.riskLevel === '1' ? 'risk-level-4' :
                row.riskLevel === '2' ? 'risk-level-3' :
                  row.riskLevel === '3' ? 'risk-level-2' :
                    row.riskLevel >= '4' ? 'risk-level-1' : ''
            ]">
              {{ row.riskLevel_dictText }}
            </span>
          </template>

        </el-table-column>
        <el-table-column prop="status_dictText" label="状态" column-key="status_dictText" :filters="[
          { text: '已治理', value: 'zl' },
          { text: '未治理', value: 'wzl' },
        ]" :filter-multiple="false"> </el-table-column>
        <el-table-column prop="follow_up_user_name" label="复测情况">
          <template #default="{ row }">
            <span v-if="repeatData[row.disasterHiscode] !== undefined">
              {{ repeatData[row.disasterHiscode] }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="follow_up_user_name" label="信息卡" >
            <template #default="scope">
            <a
                href="javascript:void(0)"
                @click="handleClick(scope.row.disasterCode)"
            >
                详情
            </a>
            </template>
        </el-table-column> -->
      </el-table>


      <!-- 分页控件 -->
      <el-pagination style="margin-top:15px;" v-model:current-page="currentPage" v-model:page-size="pageSize" small
        :pager-count="5" :page-sizes="[10, 20, 30, 50]" :background="true"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 放大图片 -->
    <el-dialog @closed="handleDialogClose" v-model="dialogVisible" width="50%" style="text-align:center;">
      <router-view name="disease"></router-view>
    </el-dialog>
  </div>

  <router-view v-else name="disease" />

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

<!-- 全局样式：el-table 筛选弹出框渲染在 body 根节点，必须用非 scoped 样式 -->
<style>
/* 筛选列表直接是 ul，无 scrollbar 包裹，直接限高滚动 */
.el-table-filter__list {
  max-height: 260px !important;
  overflow-y: auto !important;
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
import { inject, ref, onMounted, onUnmounted, reactive, watch } from 'vue'
import { get_disease, get_disease_repeat, get_road_rank } from '@/api/user'
import { useRoute, useRouter } from 'vue-router';

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
const currentYear = new Date().getFullYear()
const yearFilters = ref(
  Array.from({ length: 5 }, (_, i) => ({
    text: `${currentYear - 4 + i}`,
    value: currentYear - 4 + i
  }))
)

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
    "data": { "id": btoa(encodedURI), "state": type }
  });
  playerMethods?.sendMessage({ "code": 1, "type": 'poi', "data": { "id": btoa(encodedURI), "state": type } })
}

//点击图片放大弹窗
const dialogVisible = ref(false);
// 监听路由变化控制弹窗
watch(
  () => route.name,
  (newVal) => {
    dialogVisible.value = newVal === 'disease_modal' // 根据子路由激活状态控制弹窗
  },
  { immediate: true }
)
// 弹窗关闭时清理路由
const handleDialogClose = () => {
  router.push({ name: 'diseaselist' }) // 返回父路由
}
const handleClick = (item) => {
  localStorage.setItem('diseaseinfo', JSON.stringify({ id: item }))
  router.push({
    name: 'disease_modal', // 使用子路由名称
    query: { id: item } // 可选参数
  })
}

// 下载Excel文件
const downloadExcel = async () => {

  /* 原来的逻辑暂时注释掉
  // 显示对话框让用户选择操作
  const userChoice = confirm('是否下载病害列表：\n确定：直接下载\n取消：打开文件');

  if (userChoice) {
    // 另存为
    const link = document.createElement('a');
    link.href = '/list_rm3l3d.xlsx';
    link.download = '病害列表.xlsx';
    link.click();
  } else {
    // 打开
    window.open('/list_rm3l3d.xlsx', '_blank');
  }
  */

  // const userChoice = confirm('是否导出当前真实病害列表数据？(提示: 导出大量数据时需要额外时间加载复测情况，请耐心等待，约30秒)');
  const userChoice = confirm('是否下载病害列表：\n确定：直接下载');
  if (!userChoice) return;

  try {
    loading.value = true;

    // 注意：你提到了 "调get_road_rank接口"，但根据代码逻辑，
    // 获取包含病害列表表格数据的真实接口是 "get_disease"，
    // 所以这里我使用 get_disease 去请求所有病害数据 (pagesize: 9999)
    const res = await get_disease({
      current: 1,
      pagesize: 9999, // 尺寸给定 9999 一次性获取全部数据
      searchtext: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status: status.value,
      roadName: searchroad.value,
      years: findDate.value
    });

    if (res && res.result && res.result.records) {
      const records = res.result.records;

      // 构建 Excel 表头 (以 CSV 格式导出，用 Excel 打开，去除了复测情况)
      let csvContent = "序号,病害编号,所在道路,检测时间,病害类型,风险等级,状态\n";

      // 遍历拼接每一行数据
      records.forEach((row, index) => {
        const no = index + 1;
        const code = row.disasterCode || '';
        const road = row.roadName || '';
        // 给时间末尾加上 \t 来强制转换为文本，解决 Excel 打开变成 ###### 乱码或自动转换日期的错误
        const date = (row.findDate || '') + '\t';
        const type = row.disasterType_dictText || '';
        const risk = row.riskLevel_dictText || '';
        const statusText = row.status_dictText || '';

        // 把数据防呆包裹在双引号中并用逗号拼接
        const line = `"${no}","${code}","${road}","${date}","${type}","${risk}","${statusText}"`;
        csvContent += line + "\n";
      });

      // 加上 BOM 头 \uFEFF 避免 Excel 打开时中文乱码
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = '病害列表.csv';
      link.click();
      URL.revokeObjectURL(link.href); // 释放内存
    } else {
      alert("没有获取到导出数据！");
    }
  } catch (err) {
    console.error('导出失败:', err);
    alert('导出发生错误，请查看控制台');
  } finally {
    loading.value = false;
  }
}

//点击图片放大弹窗end



//选择风险等级
const riskLevel = ref('');
const disasterType = ref('');
const status = ref('');

const findDate = ref('');

const handleFilterChange = (filters) => {

  if (filters.disasterType_dictText) {
    if (filters.disasterType_dictText[0] == null) {
      disasterType.value = '';
    } else {
      disasterType.value = filters.disasterType_dictText[0];
    }
  }
  if (filters.riskLevel) {
    if (filters.riskLevel[0] == null) {
      riskLevel.value = '';
    } else {
      riskLevel.value = filters.riskLevel[0];
    }
  }
  if (filters.status_dictText) {
    if (filters.status_dictText[0] == null) {
      status.value = '';
    } else {
      status.value = filters.status_dictText[0];
    }
  }
  if (filters.findDate) {
    if (filters.findDate[0] == null) {
      findDate.value = '';
    } else {
      findDate.value = filters.findDate[0];
    }
  }
  // 道路名称筛选 —— 分页模式下通过接口参数传递
  if (filters.roadName) {
    if (filters.roadName[0] == null) {
      searchroad.value = '';
    } else {
      searchroad.value = filters.roadName[0];
    }
  }

  currentPage.value = 1  // 筛选时重置到第一页
  fetchData();
}


// 响应式数据
const searchText = ref('')
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
    //获取路网列表
    get_disease({
      current: currentPage.value,
      pagesize: pageSize.value,
      searchtext: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status: status.value,
      roadName: searchroad.value,
      years: findDate.value
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

//点击地图
const handleMap = () => {

  // 方法1：URI组件编码方案（兼容性好）
  const encodedURI = encodeURIComponent(searchroad.value)
    .replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  console.log('点击地图触发UE', {
    "code": 1,
    "type": 'poi',
    "data": {
      disasterCode: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status: status.value,
      roadName: btoa(encodedURI),
      years: findDate.value,
      state: 'map'
    }
  });
  playerMethods?.sendMessage({
    "code": 1,
    "type": 'poi',
    "data": {
      disasterCode: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status: status.value,
      roadName: btoa(encodedURI),
      years: findDate.value,
      state: 'map'
    }
  })

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
  if (!hiscode) return
  if (repeatData[hiscode] !== undefined) return

  try {
    //获取路网列表
    get_disease_repeat({ hiscode: hiscode }).then(res => {
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
}, { immediate: true })
//查询复测情况end

// 道路筛选器
const roadFilters = ref([])
const fetchRoadFilters = () => {
  get_road_rank().then(res => {
    const list = res.result || []
    roadFilters.value = list.map(item => ({
      text: item.countName,
      value: item.countName
    }))
  }).catch(err => {
    console.error('获取道路筛选列表失败:', err)
  })
}

// 初始化加载
let filterObserver = null
onMounted(() => {
  fetchData()
  fetchRoadFilters()

  // 监听筛选面板出现，直接对 ul.el-table-filter__list 注入滚动样式
  filterObserver = new MutationObserver(() => {
    document.querySelectorAll('.el-table-filter__list').forEach(list => {
      list.style.setProperty('max-height', '260px', 'important')
      list.style.setProperty('overflow-y', 'auto', 'important')
    })
  })
  filterObserver.observe(document.body, { childList: true, subtree: true })
})

onUnmounted(() => {
  filterObserver?.disconnect()
})
</script>