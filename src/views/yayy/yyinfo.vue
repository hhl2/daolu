<!--预演-->
<template>
  <div class="roadlist_box yy_box">
    <div class="tc_box">
      <div class="tc_left">道路预演</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <!-- 表格区域 -->
    <div class="info_box yy_table">
      <el-descriptions
          class="margin-top"
          :data="tableData"
          :column="1"
          :size="size"
          :style="blockMargin"
      >
        <el-descriptions-item label="道路名称">{{ yyroadxc || '' }}</el-descriptions-item>
        <el-descriptions-item label="病害数量">{{ tableData[0]?.findBhtNum || '' }}</el-descriptions-item>
        <el-descriptions-item label="道路承载力">11吨</el-descriptions-item>
        <el-descriptions-item label="道路限重">11吨</el-descriptions-item>
      </el-descriptions>

    </div>
  </div>
</template>
<script>
export default {
  name: 'YyInfo' // 改为多单词名称
}
</script>
<script setup>

import {ref, onMounted, onBeforeMount} from 'vue'
import {get_work} from '@/api/user'
import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};


// 响应式数据
const currentPage = ref(1)
const pageSize = ref(1)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)

// 获取数据（真实API调用）
const fetchData = async (disastercode) => {
  try {
    loading.value = true

    //获取路网列表
    get_work({current: currentPage.value, pagesize: pageSize.value, searchtext: disastercode}).then(res => {
      console.log('道路预演弹窗-ue:', {current: currentPage.value, pagesize: pageSize.value, searchtext: disastercode})
      console.log('道路弹窗接口结果:', res.result.records)

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
    }).catch(err => {
      console.error('道路预演弹窗请求失败1:', err)
    });

  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  fetchData(yyroadxc.value);
})

// beforeMount 阶段
var yyroadxc = ref({})
onBeforeMount(() => {
  //1.获取本地存储值
  var roaddata = localStorage.getItem('yyroadxc');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const roadinfo = roaddata ? JSON.parse(roaddata) : null;
    console.log('道路预演信息:', roadinfo.id);
    yyroadxc.value = roadinfo.id;
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