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
          :column="3"
          :size="size"
          :style="blockMargin"
      >
        <el-descriptions-item label="病害编号">
          <a
              href="javascript:void(0)"
              @click="disastercodeclick(tableData[0]?.disasterCode,'binghai')"
          >
            {{ tableData[0]?.disasterCode || '' }}
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="检测年份">{{ tableData[0]?.findDate || '' }}</el-descriptions-item>
        <el-descriptions-item label="面积(㎡)">{{ tableData[0]?.square.toFixed(2) || '' }}</el-descriptions-item>  
        <el-descriptions-item label="埋深(m)">{{ tableData[0]?.sfthd.toFixed(2) || '' }}</el-descriptions-item>
        <el-descriptions-item label="净深(m)">{{ tableData[0]?.depth.toFixed(2) || '0' }}</el-descriptions-item>
        <el-descriptions-item label="长度(m)">{{ tableData[0]?.xmaxlength.toFixed(2) || '' }}</el-descriptions-item>
        <el-descriptions-item label="经度">{{ tableData[0]?.centerLng || '' }}</el-descriptions-item>
        <el-descriptions-item label="纬度">{{ tableData[0]?.centerLat || '' }}</el-descriptions-item>
        <el-descriptions-item label="宽度(m)">{{ disasterWidth||'' }}</el-descriptions-item>
        <el-descriptions-item label="病害类型">{{ tableData[0]?.disasterType_dictText || '' }}</el-descriptions-item>
        <el-descriptions-item label="病害状态">{{ tableData[0]?.status_dictText || '' }}</el-descriptions-item>
        <el-descriptions-item label="变化曲线">
          <a
              href="javascript:void(0)"
              @click="handle_change(tableData[0]?.roadName || '')"
          >
            详情
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="风险等级">
          {{  tableData[0]?.riskLevel_dictText  || '' }}
        </el-descriptions-item>
        <!-- <el-descriptions-item label="所在位置">{{ tableData[0]?.address || '' }}</el-descriptions-item> -->
        
        <el-descriptions-item label="雷达图谱">

          <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
          <a v-if="tableData[0]?.radarImg!=null"
             href="javascript:void(0)"
             @click="handleClick('https://www.roadradar.cn/dljcboot/sys/common/static/'+tableData[0]?.radarImg)"
          >
            详情
          </a>
        </el-descriptions-item>
        <el-descriptions-item label="所在道路">
          <a
              href="javascript:void(0)"
              @click="disastercodeclick(tableData[0]?.roadName,'daolu')"
          >
            {{ tableData[0]?.roadName || '' }}
          </a>
        </el-descriptions-item>
        
        
        <el-descriptions-item label="所在位置" :column="2">{{ tableData[0]?.address || '' }}</el-descriptions-item>
      </el-descriptions>

    </div>

    <!--轮播区域-->
    <div class="swiper_box">
      <swiper
          :modules="modules"
          :slides-per-view="3"
          :space-between="50"
          navigation
          :pagination="{ clickable: true }"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
      >
        <swiper-slide v-for="item in banner" :key="item" @click="handleClick(item)">
          <el-image
              :src="item"
              fit="cover"
          />
        </swiper-slide>

      </swiper>
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

  <!-- 放大图片 -->
  <el-dialog v-model="dialogVisible" width="80%" style="text-align:center;">
    <img :src="currentImage" class="enlarge-image" style="max-width:100%;"/>
  </el-dialog>

  <!-- 变换曲线 -->
  <el-dialog v-model="dialog_change" width="80%" style="text-align:center;">
    <div ref="disease_risk" class="chart-container" style="width:900px;height: 400px;"></div>
  </el-dialog>
</template>

<script setup>

import {inject, nextTick, onBeforeMount, onMounted, ref} from 'vue'
import {get_disease, get_risk,get_work} from '@/api/user'


import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/vue';
import {Navigation} from 'swiper/modules'; // 必须导入模块 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css'; // 核心样式 :ml-citation{ref="3,8" data="citationList"}
import 'swiper/css/navigation'; // 导航按钮样式 :ml-citation{ref="3,8" data="citationList"}
const modules = [Navigation];                 // 模块配置 :ml-citation{ref="3,8" data="citationList"}

const roadvalue = ref([]);

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


//轮播图
const banner = ref([]);
//点击图片放大弹窗
const dialogVisible = ref(false);
const currentImage = ref('');

const handleClick = (item) => {
  currentImage.value = item;
  dialogVisible.value = true;
}

//点击图片放大弹窗end
 

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
          interval: Math.max(res.result.length - 2, 0),
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
          name: '数量',
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

var riskLevel = ref('');
var disasterType = ref('');
var status = ref('');
const searchroad = ref('')

// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(1)
const total = ref(0)
const tableData = ref([])
const disasterWidth = ref('');
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

    banner.value = []; 
    get_disease({
      current: currentPage.value,
      pagesize: pageSize.value,
      searchtext: searchText.value,
      riskLevel: riskLevel.value,
      disasterType: disasterType.value,
      status_dictText: status.value,
      roadName: searchroad.value
    }).then(res => {
      console.log('病害基本信息:', res)
      if (res.result.records[0].dingweiImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].dingweiImg);
      }

      if (res.result.records[0].radarImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].radarImg);
      }
      if (res.result.records[0].xianchangImg != null) {
        banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/' + res.result.records[0].xianchangImg);
      }
      /*if(res.result.records[0].zuankongImg !=null){
          banner.value.push('https://www.roadradar.cn/dljcboot/sys/common/static/'+res.result.records[0].zuankongImg);
      }*/
        

      tableData.value = res.result.records  
      
      if(res.result.records.length>0 && res.result.records[0].square){
        tableData.value.square = res.result.records[0].square.toFixed(2);
      }      
      if(res.result.records.length>0 && res.result.records[0].sfthd){
        tableData.value.sfthd = res.result.records[0].sfthd.toFixed(2);
      }  
      if(res.result.records.length>0 && res.result.records[0].depth){
        tableData.value.depth = res.result.records[0].depth.toFixed(2);
      }
      if(res.result.records.length>0 && res.result.records[0].square && res.result.records[0].xmaxlength){
          disasterWidth.value =  (res.result.records[0].square/res.result.records[0].xmaxlength).toFixed(2) 
      }
      
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
      console.log(banner.value);

      //这个主要是查询道路长度高度，但是这里没有道路id，只能查道路名了
      get_work({
        searchtext:res.result.records[0].roadName,
        current: 1,
        pagesize: 1000,
        riskLevel: ''
      }).then(value=>{
        console.log('daoluexinxi',value.result.records);
        roadvalue.value=value.result.records;
      });
    }).catch(err => {
      console.error('病害基本信息请求失败1:', err)
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
onMounted(() => {
  fetchData();
});

// beforeMount 阶段
onBeforeMount(() => {
  //1.获取本地存储值
  var diseasedata = localStorage.getItem('diseaseinfo');
  // 2. 解析 JSON 数据（带错误处理）
  try {
    const diseaseinfo = diseasedata ? JSON.parse(diseasedata) : null;

    searchText.value = diseaseinfo.id;
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