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
        <el-descriptions-item label="名称">

          <a
              href="javascript:void(0)"
              @click="disastercodeclick(tableData[0]?.roadName,'daolu')"
          >
            {{ tableData[0]?.roadName || '' }}
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="长度(m)">{{ tableData[0]?.length || '' }}</el-descriptions-item>
        <el-descriptions-item label="起点">{{ tableData[0]?.startLocation || '' }}</el-descriptions-item>
        <el-descriptions-item label="宽度(m)">{{ tableData[0]?.width || '' }}</el-descriptions-item>
        <el-descriptions-item label="终点">{{ tableData[0]?.endLocation || '' }}</el-descriptions-item>
        <el-descriptions-item label="测线条数">{{ tableData[0]?.cexiannum || '' }}</el-descriptions-item>
        <el-descriptions-item label="养护等级">{{ tableData[0]?.maintainLevel_dictText || '' }}</el-descriptions-item>
        <el-descriptions-item label="使用年限">{{ tableData[0]?.uselimit || '' }}</el-descriptions-item>
        <el-descriptions-item label="车道数" :column="2">{{ tableData[0]?.laneNum || '' }}</el-descriptions-item>
      </el-descriptions>

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
</template>

<script setup>
import {inject, onBeforeMount, onMounted, ref} from 'vue'
import {get_work} from '@/api/user'

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

    //获取路网列表
    get_work({current: currentPage.value, pagesize: pageSize.value, searchtext: searchText.value}).then(res => {
      console.log('道路列表info:', res)

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      pageSize.value = res.result.size

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
  var roaddata = localStorage.getItem('roadinfo');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const roadinfo = roaddata ? JSON.parse(roaddata) : null;
    console.log('道路ID:', roadinfo.id);
    searchText.value = roadinfo.id;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})

</script>
    