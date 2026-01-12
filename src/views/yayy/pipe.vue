<!--预演-->
<template>
  <div class="roadlist_box yy_box">
    <div class="tc_box">
      <div class="tc_left">管道属性</div>
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
        <el-descriptions-item label="管线序号">{{ gxsx ? gxsx.number : '' }}</el-descriptions-item>
        <el-descriptions-item label="管道类型">{{ gxsx ? gxsx.type : '' }}</el-descriptions-item>
        <el-descriptions-item label="材质">{{ gxsx ? gxsx.caizhi : '' }}</el-descriptions-item>
        <el-descriptions-item label="管径(mm)">{{ gxsx ? gxsx.guanjing : '' }}</el-descriptions-item>
        <el-descriptions-item label="深度(m)">{{ gxsx ? gxsx.shendu : '' }}</el-descriptions-item>
        <el-descriptions-item label="流向">{{ gxsx ? gxsx.direction : '' }}</el-descriptions-item>
        <el-descriptions-item label="阀门位置">{{ gxsx ? gxsx.position : '' }}</el-descriptions-item>
        <el-descriptions-item label="所在道道路">{{ gxsx ? gxsx.road : '' }}</el-descriptions-item>
      </el-descriptions>

    </div>
  </div>
</template>
<script>
export default {
  name: 'YayyPlanning' // 改为多单词名称
}
</script>
<script setup>

import {ref, onMounted, onBeforeMount} from 'vue'
// import { get_disease,get_token } from '@/api/user'
import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};


// 响应式数据
// const currentPage = ref(1)
// const pageSize = ref(1)
// const total = ref(0)
// const tableData = ref([])
// const loading = ref(false)

// 获取数据（真实API调用）
// const fetchData = async (disastercode) => {
// try {
//     loading.value = true

//     // 先获取token
//     await get_token().then(res => {
//         console.log('token:', res)
//         //获取路网列表
//         get_disease({current:currentPage.value,pagesize:pageSize.value,token:res.result.token,searchtext:disastercode}).then(res => {
//             console.log('预演弹窗-ue:', {current:currentPage.value,pagesize:pageSize.value,token:res.result.token,searchtext:disastercode})
//             console.log('预演弹窗接口结果:', res.result.records)

//             tableData.value = res.result.records
//             total.value = res.result.total
//             currentPage.value = res.result.current
//             // pageSize.value = res.result.size
//         }).catch(err => {
//             console.error('请求失败1:', err)
//         });

//     }).catch(err => {
//         console.error('获取token失败:', err)
//     });


// } finally {
//     loading.value = false
// }
// }

// 初始化加载
onMounted(() => {
  // fetchData(yyxc.value);
})

// beforeMount 阶段
var gxsx = ref({});
onBeforeMount(() => {
  //1.获取本地存储值
  var roaddata = localStorage.getItem('gdsx');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const roadinfo = roaddata ? JSON.parse(roaddata) : null;
    console.log('管道属性信息:', roadinfo);
    gxsx.value = roadinfo;
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