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

    <!-- 表格区域riskLevel -->
    <div class="info_box">
      <el-descriptions
          class="margin-top"
          :data="tableData"
          :column="2"
          :size="size"
          :style="blockMargin"
      >
        <el-descriptions-item label="道路风险等级">
                <span :class="[
    tableData[0]?.riskLevel === '1' ? 'risk-level-1' :
    tableData[0]?.riskLevel === '2' ? 'risk-level-2' :
    tableData[0]?.riskLevel === '3' ? 'risk-level-3' :
    tableData[0]?.riskLevel >= '4' ? 'risk-level-4' : ''
  ]">
        {{ tableData[0]?.riskLevel_dictText || '' }}
  </span>

        </el-descriptions-item>
        <el-descriptions-item label="风险指数变化曲线">
          <a
              href="javascript:void(0)"
              @click="handle_change(tableData[0]?.roadName || '')"
          >
            详情
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="风险指数">{{ tableData[0]?.riskNum || '' }}</el-descriptions-item>
        <el-descriptions-item label="应对建议">
                <span :class="[
    tableData[0]?.riskLevel === '1' ? 'risk-level-1' :
    tableData[0]?.riskLevel === '2' ? 'risk-level-2' :
    tableData[0]?.riskLevel === '3' ? 'risk-level-3' :
    tableData[0]?.riskLevel >= '4' ? 'risk-level-4' : ''
  ]">
                {{
                    tableData[0]?.riskLevel === '1' ? '立即工程处理' : tableData[0]?.riskLevel === '2' ? '尽快处理' : tableData[0]?.riskLevel === '3' ? '定期巡查' : tableData[0]?.riskLevel === '4' ? '定期巡查' : ''
                  }}
  </span>
        </el-descriptions-item>

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

  <!-- 变换曲线 -->
  <el-dialog v-model="dialog_change" width="80%" style="text-align:center;">
    <div ref="disease_risk" class="chart-container" style="width:900px;height: 400px;"></div>
  </el-dialog>
</template>

<script setup>
import {nextTick, onBeforeMount, onMounted, ref} from 'vue'
import {get_risk, get_road_yj} from '@/api/user'

import * as echarts from 'echarts';

//变换曲线
const dialog_change = ref(false);
const handle_change = (item) => {
  console.log(item);
  dialog_change.value = true;

  // 使用 nextTick 确保 DOM 已经渲染完成
  nextTick(() => {
    initChart(item);
  });
}

var disease_risk = ref(null); // 创建图表容器的 ref
const initChart = (item) => {
  //病害风险等级
  get_risk({searchtext: item}).then(res => {
    const years = [];
    const risk = [];
    res.result.forEach(item => {
      years.push(item.countName.split(' ')[0])
      risk.push(item.countNums)
    });

    console.log('风险曲线', res);
    var disease_risk_chart = echarts.init(disease_risk.value);
    const disease_risk_option = {
      //色块
      legend: {
        data: ['风险等级'],
        textStyle: {
          color: '#fff'
        }
      },
      title: {
        x: 'center',
        subtextStyle: {//副标题文本样式{"color": "#aaa"}
          color: '#fff',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
        },

      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },

      },
      grid: {
        top: "20",
        /*left: "30",
        right: "10",*/
        bottom: "20"
      },
      xAxis: {
        data: years,
        axisLabel: {
          //interval: Math.max(res.result.length - 2, 0),
          color: '#fff'
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        z: 10
      },
      yAxis: [
        {
          position: "left",
          min: 0,       // 强制设置最小值
          max: 1,       // 强制设置最大值
          interval: 0.2,// 固定刻度间隔
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          splitArea: {
            show: true,  // 开启区域分割
            interval: 0.2,  // 与 Y 轴刻度间隔保持一致
            areaStyle: {
              color: [ // 交替颜色设置
                'rgba(23, 151, 23, 1)',
                'rgba(93, 182, 255, 1)',
                'rgba(241, 255, 84, 1)',
                'rgba(255, 126, 34, 1)',
                'rgba(255, 21, 60, 1)',
              ]
            }
          },

          splitNumber: 4, //设置坐标轴的分割段数
          axisLabel: {
            min: 0,       // 强制设置最小值
            max: 1,       // 强制设置最大值
            interval: 0.2,// 固定刻度间隔
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              type: 'solid',
              color: '#fff',
              width: '1'
            }
          },
        },
        {
          //name: "入驻(%)",
          type: "value",
          min: 0,       // 强制设置最小值
          max: 1,       // 强制设置最大值
          interval: 0.2,// 固定刻度间隔
          splitNumber: 4,
          position: "right",
          axisLabel: {
            textStyle: {fontSize: 11, color: '#fff'},
            formatter: function (val) {
              return val * 1 == 0 ? '安全级' : (val * 1 == 0.2 ? 'ⅠV' : (val * 1 == 0.4 ? 'III' : val * 1 == 0.6 ? 'II' : val * 1 == 0.8 ? 'I' : ''))
            },     // 给坐标轴标签加单位
          },
          //y轴横向分割线
          splitLine: {
            show: false,
            lineStyle: {color: '#d4d7da'}
          },
          formatter: "{value}%",
          nameTextStyle: {fontSize: 12},
          itemStyle: {
            color: "#fff"
          },
        }
      ],

      series: [
        {
          name: '企业数量',
          type: 'line',
          barWidth: "12",
          smooth: true,
          showBackground: false, //柱状背景
          backgroundStyle: { //背景颜色，加透明度
            color: 'rgba(110, 193, 244, 0.2)',
          },
          itemStyle: {
            normal: {
              //每根柱子颜色设置
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {offset: 0, color: '#FFEECF '},
                {offset: 0.5, color: '#FFB32E '},
                {offset: 1, color: '#FFB32E '}
              ]),
              //这里设置柱形图圆角 [左上角，右上角，右下角，左下角]
              barBorderRadius: [10, 10, 0, 0]
            }
          },
          //柱状图上显示数据
          label: {
            show: false,
            position: "top",
            color: "#FFF",
            fontWeight: "bolder",
            fontSize: "14"
          },
          data: risk,
          //barGap:0.4,
        },

      ]
    };
    disease_risk_chart.setOption(disease_risk_option);

  }).catch(err => {
    console.error('获取病害风险等级失败1:', err)
  });


};
//变换曲线end


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

    get_road_yj({current: currentPage.value, pagesize: pageSize.value, searchtext: searchText.value}).then(res => {
      console.log('道路风险risk:', res)

      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
    }).catch(err => {
      console.error('道路风险预警列表请求失败1:', err)
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
    console.log('道路风险等级ID:', roadinfo.id);
    searchText.value = roadinfo.id;
  } catch (e) {
    console.error('数据解析失败:', e);
  }
})
</script>
    