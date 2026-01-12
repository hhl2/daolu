<!--实时巡检-->
<template>
  <div class="roadlist_table">

    
    <!-- 表格区域 -->
    <div class="info_box" style="margin-top:40px;">
      <el-descriptions
          class="margin-top"
          :data="tableData"
          :column="4"
          :size="size"
          :style="blockMargin"
      >
        <el-descriptions-item>
          <el-select v-model="value" placeholder="请选择" style="width: 240px">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
            />
          </el-select>
        </el-descriptions-item>
        <el-descriptions-item label="时间">2025/4/10</el-descriptions-item>
        <el-descriptions-item label="负责人"></el-descriptions-item>
        <el-descriptions-item label="联系电话"></el-descriptions-item>
      </el-descriptions>

    </div>
    <div>
      <img src="@/assets/jk.png" style="width:100%;height:100%;"/>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {get_work} from '@/api/user'

//const selectedValue = ref('');
//const options = ref([]);
const value = ref('')
const options = [
  {
    value: '1',
    label: '设备1',
  },
]
/*const handleSelectChange = (value) => {
    console.log('选中值:', value);
};*/


// 响应式数据
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
    get_work({current: currentPage.value, pagesize: pageSize.value}).then(res => {
      console.log('道路列表:', res)


      // 假设接口返回格式为 [{ id: 1, name: '选项1' }, ...]
      /*options.value = response.data.map(item => ({
      value: item.id,
      label: item.name
      }));*/

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


// 初始化加载
onMounted(fetchData)
</script>
    