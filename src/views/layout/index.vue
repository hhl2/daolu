<template>
  <div class="xm_title">
    <img src="@/assets/xm_title.png" />
  </div>
  <div class="xm_date">
    {{ formattedDate }} {{ formattedTime }} {{ weekDay }}
  </div>

  <!-- <div class="toggle_box">
    <img src="@/assets/toggle.png" fit="contain" @click="toggle_box()"/>
  </div> -->

  <div class="kongjian">
    <VerticalSlider />
    <router-link to="/analysis" @click.stop="ue5click(15)"><img src="@/assets/kongjianfenxi.png" /></router-link>
    <router-link to="/analysis" @click.stop="ue5click(16)"><img src="@/assets/daolufenxi.png" /></router-link>
    <router-link to="/analysis" @click.stop="ue5click(17)"><img src="@/assets/qingchu.png" /></router-link>
    <router-link to="/analysis" @click="toggle_box()"><img src="@/assets/chuangkou.png" /></router-link>
  </div>

  <div class="footer_dev">开发单位：中科云图科技有限公司</div>

  <!--<div class="top_box">
      <div class="top_box_btn active">监控指挥</div>
      <div class="top_box_btn">Ai接口</div>
  </div>-->

  <div class="menu_box">
    <ul>
      <!-- 一级菜单 -->
      <li v-for="(menu, index) in links" :key="index" @click="showSub(index), ue5click(menu.id)"
        :class="{ 'has_sub': activeSub === index }">
        <!-- 无子级时使用 router-link 跳转 -->
        <router-link v-if="!menu.children" :to="menu.path" :class="{ 'active': $route.path === menu.path }">
          {{ menu.text }}
        </router-link>
        <router-link v-else class="main-menu" :to="{ path: '/' }">{{ menu.text }}</router-link>
        <!-- 二级菜单 -->
        <ul v-if="menu.children" class="sub-menu" :class="{ 'show': activeSub === index }">
          <li v-for="(sub, subIndex) in menu.children" :key="subIndex" @click.stop="ue5click(sub.id)"
            :class="{ 'active': activeMenu == sub.path }">
            <router-link :to="sub.path" @click="activeMenu = sub.path">
              {{ sub.text }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>

  <!--左右两边在这-->
  <div class="left" v-show="isVisible">
    <!--{{ chartRef_data.xaxis }}-->
    <div class="title">病害类型及数量</div>
    <div ref="disease_type" class="chart-container" style="height: 220px;"></div>
    <div class="title">病害趋势</div>
    <div ref="disease_trends" class="chart-container" style="height: 290px;"></div>
    <div class="title">成因统计</div>
    <div ref="disease_cause" class="chart-container" style="height: 290px;"></div>
  </div>
  <div class="right" v-show="isVisible">
    <div class="title">风险等级</div>
    <div ref="disease_risk" class="chart-container" style="height: 185px;"></div>
    <div class="title">病害治理情况统计</div>
    <div ref="disease_fixed" class="chart-container" style="height: 185px;"></div>
    <!-- <div ref="disease_kilometers" class="chart-container" style="height: 185px;"></div> -->
    <div class="title">按行政区排名</div>
    <div class="layout_table">
      <div class="scroll-container" ref="container" @mouseenter="pauseScroll" @mouseleave="resumeScroll">
        <table>
          <!-- 固定表头 -->
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
            </tr>
          </thead>

          <!-- 滚动内容 -->
          <tbody :style="{ transform: `translateY(-${offset}px)` }">
            <!-- 渲染原始数据 -->
            <tr v-for="(row, index) in data" :key="index">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex"
                :style="cellIndex === 3 ? 'display:none' : 'text-align:center'"
                @click="cellIndex === 1 ? xzqclick(cell, row[2], row[3]) : null">{{ cell }}</td>
            </tr>

            <!-- 复制数据实现无缝滚动 -->
            <tr v-for="(row, index) in data" :key="index + '_copy'">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex + '_copy'"
                :style="cellIndex === 3 ? 'display:none' : 'text-align:center'">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="title">按道路排名</div>

    <div class="layout_table">
      <div class="scroll-container" ref="container_road" @mouseenter="pauseScroll_road" @mouseleave="resumeScroll_road">
        <table>
          <!-- 固定表头 -->
          <thead>
            <tr>
              <th v-for="(header, index) in headers_road" :key="index">{{ header }}</th>
            </tr>
          </thead>

          <!-- 滚动内容 -->
          <tbody :style="{ transform: `translateY(-${offset_road}px)` }">
            <!-- 渲染原始数据 -->
            <tr v-for="(row, index) in data_road" :key="index">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex" style="text-align:center;"
                @click="cellIndex === 1 ? daoluclick(cell) : null">
                {{ cellIndex == 2 ? (toRoman(cell) || 'I') : cell }}
              </td>
            </tr>

            <!-- 复制数据实现无缝滚动 -->
            <tr v-for="(row, index) in data_road" :key="index + '_copy'">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex + '_copy'" style="text-align:center;">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
  <!-- ECharts 图表容器 -->

  <router-view />
</template>
<style>
.header {
  padding: 10px;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}


.scroll-container {
  height: 195px;
  overflow: hidden;
  position: relative;
  /* border: 1px solid #eee; */
  color: #fff;
  font-size: 12px;
}

.layout_table table {
  width: 100%;
  border-collapse: collapse;
}

.layout_table th {
  background: url('@/assets/th_bg.png');
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 5px;
}

.layout_table tr:nth-child(odd) {
  background: url('@/assets/tr_bg.png') no-repeat;
  background-size: cover;
}

.layout_table tr:hover {
  background: url('@/assets/tr_hoverbg.png') no-repeat;
  background-size: cover;
}

.layout_table td {
  padding: 5px;
  /* border-bottom: 1px solid #e8e8e8; */
  height: 20px;
  /* 需与 JS 中的 ROW_HEIGHT 一致 */
}

.layout_table tbody {
  will-change: transform;
  /* 优化动画性能 */
}

.toggle_box {
  position: fixed;
  top: 20px;
  left: 15%;
  z-index: 35;
  cursor: pointer;
}

.kongjian {
  position: fixed;
  z-index: 32;
  display: flex;
  flex-direction: column;
  right: 405px;
  bottom: 220px;
}
</style>

<script>
export default {
  name: 'LayoutIndex' // 改为多单词名称
}
</script>
<script setup>
import VerticalSlider from '@/views/layout/VerticalSlider.vue'
import { inject, onMounted, onUnmounted, ref, computed, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts';
// import { getUserList,createUser } from '@/api/user'
import {
  get_cause,
  get_trends,
  get_disease_type,
  get_disease_level,
  get_road_rank,
  get_road_state,
  get_road_kilometer,
  get_disease_fixed
} from '@/api/user'
import { useRoute } from 'vue-router';

const route = useRoute();



// 修改后的嵌套菜单结构
const links = [
  {
    id: '10',
    text: '可视化病害',
    children: [
      // { text: '病害', path: '/disease',id:'11'},
      { text: '病害列表', path: '/diseaselist', id: '12' },
      { text: '病害追踪', path: '/diseasetrack', id: '13' },
      { text: '塌陷列表', path: '/taxianlist', id: '18' },
      { text: '统计图表', path: '/chart', id: '14' },
      // { text: '空间分析', path: '/analysis',id:'15' },
    ]
  },
  {
    id: '20',
    text: '一路一档',
    children: [
      // { text: '路网', path: '/roadmap',id:'21' },
      { text: '道路列表', path: '/road_list', id: '22' },
      { text: '病害热力图', path: '/disease_map', id: '23' },
      { text: '积水路段', path: '/water', id: '24' },
    ]
  },
  // {   id:'30',
  //     text: '流程管理',
  //     children: [
  //         { text: '检测', path: '/detection',id:'31' },
  //         { text: '处置', path: '/dispose',id:'32' },
  //         { text: '巡检', path: '/inspection',id:'33' },
  //     ]
  // },
  {
    id: '30',
    text: '流程管理',
    path: '/projectprocess',
  },
  {
    id: '40',
    text: '预案预演',
    children: [
      { text: '预案', path: '/severe', id: '41' },
      { text: '预演', path: '/yy', id: '42' },
    ]
  },
  {
    id: '50',
    text: '监控指挥', path: '/monitor'
  },
  {
    id: '70',
    text: '传感器监测', path: '/sensor'
  },
  {
    id: '60',
    text: '人工智能',
    children: []
    // path: '/ai'
  },
];
// 添加二级菜单控制
const activeMenu = ref(route.path); // 直接绑定路由路径‌:ml-citation{ref="2,4" data="citationList"
const activeSub = ref(-1)
const showSub = (index) => {
  console.log(index);
  activeSub.value = index

  if (6 == index) {
    document.getElementById('aidiv').style.display = 'block';
    window.cozeclient.showChatBot();
  }
}

/* 触发ue5 */
// 注入父组件提供的方法
const playerMethods = inject('playerMethods')
// 封装调用逻辑
const callParentMethod = (message) => {
  if (playerMethods?.sendMessage) {
    playerMethods.sendMessage(message)
  } else {
    console.error('方法未成功注入')
  }
}
const ue5click = (index) => {
  console.log('点击触发', { "code": 1, "type": "btn", "data": { "id": index } });
  callParentMethod({ "code": 1, "type": "btn", "data": { "id": index } });
}
/* 触发ue5 */

/*点击隐藏左右两侧 */
let isVisible = ref(true);
const toggle_box = () => {
  console.log('隐藏左右');
  isVisible.value = !isVisible.value;
}


//点击道路触发
const daoluclick = (cell) => {
  // 方法1：URI组件编码方案（兼容性好）
  const encodedURI = encodeURIComponent(cell)
    .replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  console.log('点击了道路排名', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'daolu' } });
  callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'daolu' } });
}

//点击行政区触发
const xzqclick = (cell, num, xzq) => {
  // 方法1：URI组件编码方案（兼容性好）
  const encodedURI = encodeURIComponent(cell)
    .replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
  console.log('点击了行政区', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "nums": num, "code": xzq, "state": 'xzq' } });
  callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "nums": num, "code": xzq, "state": 'xzq' } });
}
// const hideSub = (index) => {
//     activeSub.value = -1
// }

//表格1
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

// 表格数据
const headers = ['序号', '区位名称', '病害数量'];
var data = [];

// 滚动控制
const container = ref(null);
const offset = ref(0);
let animationFrameId = null;
let isScrolling = true;
// 计算单行高度（需根据实际样式调整）
const ROW_HEIGHT = 20;
// 滚动动画
const startScroll = () => {
  const maxOffset = data.length * ROW_HEIGHT;

  const animate = () => {
    if (!isScrolling) return;
    offset.value += 0.3;
    // 滚动到复制数据末尾时，重置位置
    if (offset.value >= maxOffset) {
      offset.value = 0;
    }
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();
};

// 暂停滚动
const pauseScroll = () => {
  isScrolling = false;
  cancelAnimationFrame(animationFrameId);
};

// 恢复滚动
const resumeScroll = () => {
  if (!isScrolling && data.length > 5) {
    isScrolling = true;
    startScroll();
  }
};

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  cancelAnimationFrame(animationFrameId_road);
});
//表格end

//表格2
// 表格数据
const headers_road = ['序号', '道路名称', '风险等级', '病害数量'];
var data_road = [];


// 滚动控制
const container_road = ref(null);
const offset_road = ref(0);
let animationFrameId_road = null;
let isScrolling_road = true;
// 计算单行高度（需根据实际样式调整）
const ROW_HEIGHT_road = 20;
// 滚动动画
const startScroll_road = () => {
  const maxOffset = data_road.length * ROW_HEIGHT_road;

  const animate = () => {
    if (!isScrolling_road) return;
    offset_road.value += 0.3;
    // 滚动到复制数据末尾时，重置位置
    if (offset_road.value >= maxOffset) {
      offset_road.value = 0;
    }
    animationFrameId_road = requestAnimationFrame(animate);
  };

  animate();
};

// 暂停滚动
const pauseScroll_road = () => {
  isScrolling_road = false;
  cancelAnimationFrame(animationFrameId_road);
};

// 恢复滚动
const resumeScroll_road = () => {
  if (!isScrolling_road && data_road.length > 5) {
    isScrolling_road = true;
    startScroll_road();
  }
};

//表格end

// --------------- 修复未使用变量 ---------------

//病害类型及数量
var disease_type = ref(null); // 创建图表容器的 ref
//病害趋势
var disease_trends = ref(null); // 创建图表容器的 ref
//病害成因统计
var disease_cause = ref(null); // 创建图表容器的 ref
//病害风险等级
var disease_risk = ref(null); // 创建图表容器的 ref
//每KM
var disease_kilometers = ref(null); // 创建图表容器的 ref
//病害治理情况
var disease_fixed = ref(null); // 创建图表容器的 ref

//案例柱状图
// const chart2 = ref(null); // 创建图表容器的 ref
//案例
// const chartRef = ref(null); // 创建图表容器的 ref
// const chartRef_data = ref({});       // 数据存储
// onUnmounted(() => {
//   // 清理资源
//   resizeObserver.disconnect()
//   myChart?.dispose()
//   myChart2?.dispose()
// });

//显示时间start
// 定义响应式时间对象
const now = ref(new Date());
let timer = null;

// 补零函数（确保两位数显示）
const complement = (value) => {
  return value < 10 ? `0${value}` : value;
};

// 时间格式化
const formatDateTime = () => {
  const date = now.value;
  return {
    year: date.getFullYear(),
    month: complement(date.getMonth() + 1),
    day: complement(date.getDate()),
    hour: complement(date.getHours()),
    minute: complement(date.getMinutes()),
    second: complement(date.getSeconds()),
    week: date.getDay()  // 返回 0-6（0=星期日）
  };
};

// 计算属性式输出
const formattedDate = computed(() => {
  const { year, month, day } = formatDateTime();
  return `${year}年${month}月${day}日`;
});

const formattedTime = computed(() => {
  const { hour, minute, second } = formatDateTime();
  return `${hour}:${minute}:${second}`;
});

const weekDay = computed(() => {
  const weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return weekMap[formatDateTime().week];
});

// 清除定时器
onBeforeUnmount(() => {
  clearInterval(timer);
});
//显示时间end

//生命周期
onMounted(async () => {
  //显示时间
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
  //显示时间end


  //行政区排名
  get_road_state().then(res => {
    console.log('行政区排名:', res)
    const series = res.result.sort((a, b) =>
      b.countNums - a.countNums  // 降序核心逻辑
    );
    console.log('1212', series)

    data = Array.from({ length: series.length }, (_, i) => [
      i + 1,
      series[i]['countName'],
      series[i]['countNums'],
      series[i]['countColCode'],
    ]);

    if (series.length > 5) {
      startScroll();
    }
  }).catch(err => {
    console.error('获取全市道路排名失败1:', err)
  });


  //全市道路排名
  get_road_rank().then(res => {
    console.log('全市道路排名:', res)
    const series = res.result.sort((a, b) =>
      b.countNums - a.countNums  // 降序核心逻辑
    );
    console.log('1212', series)

    data_road = Array.from({ length: series.length }, (_, i) => [
      i + 1,
      series[i]['countName'],
      series[i]['riskLevel'],
      series[i]['countNums'],
    ]);

    if (series.length > 5) {
      startScroll_road();
    }
  }).catch(err => {
    console.error('获取全市道路排名失败1:', err)
  });

  //病害类型及数量
  get_disease_type().then(res => {
    console.log('病害数量:', res)
    // const series = res.result.map(item => {
    //     console.log('病害合并',item);

    //     return {
    //         name: item['countName'], // 分类名称
    //         value: item['countNums'] // 转换为数值型 [16,53,110]
    //     };
    // }, []);

    // 病害类型排序：空洞(红) → 脱空(橙) → 疏松体(黄)，危害由重到轻
    const typeOrder = ['空洞', '脱空', '疏松体'];
    const typeColorMap = {
      '空洞': '#ff0000',
      '脱空': '#ffc000',
      '疏松体': '#ffff00'
    };
    const series = res.result.reduce((acc, item) => {
      const name = item['countName'];
      const value = parseInt(item['countNums']);

      // 合并两类疏松体
      if (name === '严重疏松体' || name === '一般疏松体') {
        const existing = acc.find(i => i.name === '疏松体');
        if (existing) {
          existing.value += value;
        } else {
          acc.push({
            name: '疏松体',
            value,
            itemStyle: { color: typeColorMap['疏松体'] }
          });
        }
      } else {
        acc.push({
          name,
          value,
          itemStyle: { color: typeColorMap[name] || undefined }
        });
      }

      return acc;
    }, []).sort((a, b) => {
      const ai = typeOrder.indexOf(a.name);
      const bi = typeOrder.indexOf(b.name);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });


    console.log('病害数量总数', res.result.reduce((a, b) => a + b.countNums, 0))
    var disease_type_chart = echarts.init(disease_type.value);
    const disease_type_option = {
      tooltip: {
        trigger: 'item',
        formatter: function (c) {

          return '<span style="display: inline-block;padding: 5px 0;" >' +
            '<i style="display: inline-block;border-radius:50%;width: 10px;height: 10px;background: ' + c.color +
            ';}"></i> ' +
            '<span style="margin-right:5px;">' + c.name + '</span>' + c.percent + '%' +
            '</span>';
        }
      },

      legend: {
        selectedMode: false,
        orient: 'vertical',
        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        x: 190,
        y: 55,
        itemGap: 15,
        textStyle: { //图例文字的样式
          color: '#fff',
          fontSize: 12,
          rich: {
            a: {
              fontSize: 12,
              verticalAlign: 'top',
              align: 'left',
              width: 10,
              color: '#A7D0EA',
              //padding:[0,0,28,0]
            },
            b: {
              fontSize: 12,
              align: 'right',
              width: 100,
              padding: [0, 0, 0, 0],
              color: '#19FFFC',
              //lineHeight:25
            }
          }
        },
        // 使用回调函数
        formatter: function (name) {
          var data = disease_type_option.series[0].data;
          var total = 0;
          var tarValue;
          for (var i = 0, l = data.length; i < l; i++) {
            total += data[i].value;
            if (data[i].name == name) {
              tarValue = data[i].value;
            }
          }
          var p = ((tarValue));

          var arr = [
            '{a|' + name + '}',
            '{b|' + p + '}',
          ]
          return arr.join(' ')
          //return name + " " + " " + p ;
        },

        //data:['B1','F1','F2']
      },

      // color: ['#ffff00', '#00b0f0', '#ff0000', '#ffc000',],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          center: ['25%', '50%'],
          itemStyle: {
            borderWidth: 2,	//边框的宽度
            borderColor: '#494a5f'	//边框的颜色
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              /*formatter:function(e){
                  return '4000 \n 总面积（亩）'
              },
              textStyle: {
                  color: '#fff',  // 改变标示文字的颜色
                  fontSize: 20
              }*/
              formatter: '{name|' + res.result.reduce((a, b) => a + b.countNums, 0) + '}\n{time|总计}',
              backgroundColor: 'rgba(25,255,252,0.05)',
              borderColor: '#19FFFC',
              borderWidth: 1,
              borderRadius: 300,
              borderType: 'solid', // solid dotted dashed
              width: 55,
              height: 55,
              padding: 10,
              rich: {
                name: {
                  fontSize: 17,
                  color: '#19FFFC',
                  lineHeight: 35,
                  fontWeight: 'bold'
                },
                time: {
                  fontSize: 11,
                  color: '#fff'
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          // data:[{"value":"94","name":"空洞"},{"value":"316","name":"脱空"},{"value":"259","name":"严重疏松"},{"value":"170","name":"一般疏松"},{"value":"20","name":"富水体"}]
          data: series,
        },
        {

          type: 'pie',
          avoidLabelOverlap: true,
          radius: ['75%', '75%'],//边框大小
          center: ['25%', '50%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.5,//设置边框粗细
                borderColor: 'rgb(25,255,252, 1)',//边框颜色
                borderType: "dashed",//虚线
              }
            }
          }]
        },
      ]
    };
    disease_type_chart.setOption(disease_type_option);
    //点击触发事件
    disease_type_chart.on('click', function (params) {
      // 方法1：URI组件编码方案（兼容性好）
      const encodedURI = encodeURIComponent(params.data.name)
        .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );
      console.log('点击了系列', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'type' } });
      callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'type' } });

    });
  }).catch(err => {
    console.error('获取病害类型及数量失败1:', err)
  });


  //病害类型及数量end


  //病害趋势
  get_trends().then(res => {
    console.log('获取病害趋势:', res.result)
    // 步骤1：提取年份作为x轴数据
    const years = res.result[0].slice(1); // ['2021', '2022', '2023']
    // 步骤2：转换数据系列
    // 趋势图排序：空洞(红) → 脱空(橙) → 严重疏松体(黄) → 一般疏松体(黄)，危害由重到轻
    const trendOrder = ['空洞', '脱空', '严重疏松体', '一般疏松体'];
    const trendColorMap = {
      '空洞': '#ff0000',
      '脱空': '#ffc000',
      '严重疏松体': '#ffff00',
      '一般疏松体': '#ffff00'
    };
    const rawSeries = res.result.slice(1).map(item => {
      return {
        name: item[0],
        type: 'line',
        smooth: true,
        data: item.slice(1).map(Number),
        lineStyle: { color: trendColorMap[item[0]] || undefined },
        itemStyle: { color: trendColorMap[item[0]] || undefined }
      };
    }).sort((a, b) => {
      const ai = trendOrder.indexOf(a.name);
      const bi = trendOrder.indexOf(b.name);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    const series = rawSeries;
    //步骤3：获取legend（保持与series一致的排序）
    const legend = series.map(item => item.name);

    var disease_trends_chart = echarts.init(disease_trends.value);
    const disease_trends_option = {
      // title: {
      //     text: 'Stacked Area Chart'
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        // data: ['故障', '隐患', '安全事件'],
        data: legend,
        textStyle: { color: '#fff' }, // 图例文字颜色
      },
      // toolbox: {
      //     feature: {
      //     saveAsImage: {}
      //     }
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0%',
        top: '20%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: '#fff' // 红色字体
            }
          },
          // data: ['2020', '2021', '2022', '2023', '2024', '2025']
          data: years
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff' // 红色字体
            }
          },
        }
      ],
      series: series
      // series: [
      //     {
      //     name: '故障',
      //     type: 'line',
      //     stack: 'Total',
      //     smooth: true,  // 关键参数
      //     showSymbol: false,  // 不显示数据点
      //     areaStyle: {
      //         normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //         {
      //             offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
      //         },
      //         {
      //             offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
      //         },
      //         {
      //             offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
      //         }
      //         ]
      //         ),  //背景渐变色
      //         },
      //     },
      //     emphasis: {
      //         focus: 'series'
      //     },
      //     // 配置折线的样式
      //     lineStyle: {
      //         color: '#0090ff' // 折线颜色设置为红色
      //     },

      //     data: [120, 132, 101, 134, 90, 230, 210]
      //     },
      //     {
      //     name: '隐患',
      //     type: 'line',
      //     stack: 'Total',
      //     smooth: true,  // 关键参数
      //     showSymbol: false,  // 不显示数据点
      //     areaStyle: {
      //         normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //         {
      //             offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
      //         },
      //         {
      //             offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
      //         },
      //         {
      //             offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
      //         }
      //         ]
      //         ),  //背景渐变色
      //         },
      //     },
      //     emphasis: {
      //         focus: 'series'
      //     },
      //     // 配置折线的样式
      //     lineStyle: {
      //         color: '#f0ff00' // 折线颜色设置为红色
      //     },
      //     data: [220, 182, 191, 234, 290, 330, 310]
      //     },
      //     {
      //     name: '安全事件',
      //     type: 'line',
      //     stack: 'Total',
      //     smooth: true,  // 关键参数
      //     showSymbol: false,  // 不显示数据点
      //     areaStyle: {
      //         normal: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //         {
      //             offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
      //         },
      //         {
      //             offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
      //         },
      //         {
      //             offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
      //         }
      //         ]
      //         ),  //背景渐变色
      //         },
      //     },
      //     emphasis: {
      //         focus: 'series'
      //     },
      //     // 配置折线的样式
      //     lineStyle: {
      //         color: '#f29556' // 折线颜色设置为红色
      //     },
      //     data: [150, 232, 201, 154, 190, 330, 410]
      //     },

      // ]
    };
    disease_trends_chart.setOption(disease_trends_option);

    //点击触发事件
    disease_trends_chart.on('click', function (params) {
      console.log('params  点击', params)

      // 方法1：URI组件编码方案（兼容性好）
      const encodedURI = encodeURIComponent(params.seriesName)
        .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );

      console.log('点击了系列', { "code": 1, "type": "poi", "data": { "id": params.name, "name": btoa(encodedURI), "state": 'qushi' } });
      callParentMethod({ "code": 1, "type": "poi", "data": { "id": params.name, "name": btoa(encodedURI), "state": 'qushi' } });

    });

  }).catch(err => {
    console.error('获取病害趋势失败1:', err)
  });


  //病害趋势end

  //病害成因
  //获取病害成因
  var disease_cause_val = ref([])
  get_cause().then(res => {
    console.log('获取病害成因:', res.result)
    disease_cause_val.value = res.result

    // 计算总数
    const total = computed(() => {
      return processChartData(disease_cause_val.value).reduce((sum, item) => sum + (item.value || 0), 0);
    });

    var disease_cause_chart = echarts.init(disease_cause.value);
    const disease_cause_option = {
      tooltip: {
        trigger: 'item',
        formatter: function (c) {
          return '<span style="display: inline-block;padding: 5px 0;" >' +
            '<i style="display: inline-block;border-radius:50%;width: 10px;height: 10px;background: ' + c.color +
            ';}"></i> ' +
            '<span style="margin-right:5px;">' + c.name + '</span>' + c.value + '' +
            '</span>';
        }
      },
      color: ["#f1cd43", "#13ff43", "#c88342", "#4ffdc2", "#ff5a2d", "#ffb52c", "#287bfd", "#17ffff", "#04c971"],
      title: {
        left: 'center',
        top: 'center',
        subtext: `{a|${total.value}}\n{b|总计}`,
        subtextStyle: {
          fontSize: 14,
          color: "#333",
          rich: {
            a: {
              fontSize: 30,
              fontWeight: 700,
              color: '#18f9fd',
              align: 'center',
              lineHeight: 20
            },
            b: {
              fontSize: 14,

              color: '#fff',
              align: 'center',
              lineHeight: 20
            }
          }
        }
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          center: ['50%', '50%'],
          itemStyle: {
            borderWidth: 2,	//边框的宽度
            borderColor: '#494a5f'	//边框的颜色
          },

          label: {
            color: '#a7cdfd',
            fontSize: 12,
            formatter: function (c) {

              return c.name + ' （' + (parseInt(c.value) / 800 * 100).toFixed(2) + '%）';
            }

          },
          labelLine: {
            lineStyle: {
              color: '#a7cdfd'
            },
            smooth: 0.2,
            length: 10,
            length2: 20,
          },
          data: processChartData(Array.from(disease_cause_val.value))
          // data:[{"value":"1","name":"顶管施工"},{"value":"36","name":"井壁渗水"},{"value":"1","name":"人防坍塌"},{"value":"202","name":"管线漏水"},{"value":"31","name":"地铁施工"},{"value":"263","name":"地铁渗水"},{"value":"66","name":"地下水作用"},{"value":"191","name":"土地自然压实沉降"},{"value":"50","name":"其他"}]
          // data:processChartData([{countNums: 36, countName: '井壁渗水'},{countNums: 1, countName: '人防坍塌'}])
        },


        {

          type: 'pie',
          avoidLabelOverlap: true,
          radius: ['45%', '45%'],//边框大小
          center: ['50%', '50%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.5,//设置边框粗细
                borderColor: 'rgb(25,255,252, 1)',//边框颜色
                borderType: "dashed",//虚线
              }
            }
          }]
        },

        {

          type: 'pie',
          avoidLabelOverlap: true,
          radius: ['75%', '75%'],//边框大小
          center: ['50%', '50%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.5,//设置边框粗细
                borderColor: 'rgb(25,255,252, 1)',//边框颜色
                borderType: "dashed",//虚线
              }
            }
          }]
        },
      ]
    };
    disease_cause_chart.setOption(disease_cause_option);

    //点击触发事件
    disease_cause_chart.on('click', function (params) {
      // 方法1：URI组件编码方案（兼容性好）
      const encodedURI = encodeURIComponent(params.data.name)
        .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );
      console.log('点击了系列', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'disasterWhy' } });
      callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'disasterWhy' } });
    });
  }).catch(err => {
    console.error('请求失败1:', err)
  });


  // 数据处理函数
  const processChartData = (rawData) => {
    return rawData.map(item => ({
      name: item.countName,
      value: Number(item.countNums)
    }));
  };

  //病害成因end


  //病害风险等级
  get_disease_level().then(res => {

    // const series = res.result.map(item => {
    //     return {
    //         name: item['countName'], // 分类名称
    //         value: item['countNums'] // 转换为数值型 [16,53,110]
    //     };
    // });
    console.log('tetste', res.result);
    // 病害等级排序：Ⅴ → Ⅳ → Ⅲ → Ⅱ → Ⅰ，危害由重到轻
    const riskLevelMap = {
      'V级': 5, 'Ⅴ级': 5, 'V': 5, 'Ⅴ': 5,
      'IV级': 4, 'Ⅳ级': 4, 'IV': 4, 'Ⅳ': 4,
      'III级': 3, 'Ⅲ级': 3, 'III': 3, 'Ⅲ': 3,
      'II级': 2, 'Ⅱ级': 2, 'II': 2, 'Ⅱ': 2,
      'I级': 1, 'Ⅰ级': 1, 'I': 1, 'Ⅰ': 1,
    };
    const riskColorMap = {
      4: '#ff0000',   // IV: 红
      3: '#ffc000',   // III: 橙
      2: '#ffff00',   // II: 黄
      1: '#00b0f0'    // I: 蓝
    };
    const series = res.result
      .filter(item => item['countName'])
      .map(item => {
        const name = item['countName'];
        const lvl = riskLevelMap[name] || 0;
        return {
          name: name,
          value: item['countNums'],
          itemStyle: { color: riskColorMap[lvl] || undefined },
          _lvl: lvl // temporary strictly for sorting
        };
      })
      .sort((a, b) => b._lvl - a._lvl);
    console.log('病害风险等级abc:', series)
    console.log('病害风险等级总数', res.result.reduce((a, b) => a + b.countNums, 0))
    var disease_risk_chart = echarts.init(disease_risk.value);
    const disease_risk_option = {
      tooltip: {
        trigger: 'item',
        formatter: function (c) {

          return '<span style="display: inline-block;padding: 5px 0;" >' +
            '<i style="display: inline-block;border-radius:50%;width: 10px;height: 10px;background: ' + c.color +
            ';}"></i> ' +
            '<span style="margin-right:5px;">' + c.name + '</span>' + c.percent + '%' +
            '</span>';
        }
      },

      legend: {
        selectedMode: false,
        orient: 'vertical',
        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        x: 180,
        y: 40,
        itemGap: 15,
        textStyle: { //图例文字的样式
          color: '#fff',
          fontSize: 12,
          rich: {
            a: {
              fontSize: 12,
              verticalAlign: 'top',
              align: 'left',
              width: 10,
              color: '#A7D0EA',
              //padding:[0,0,28,0]
            },
            b: {
              fontSize: 12,
              align: 'right',
              width: 80,
              padding: [0, 0, 0, 0],
              color: '#19FFFC',
              //lineHeight:25
            }
          }
        },
        // 使用回调函数
        formatter: function (name) {
          var data = disease_risk_option.series[0].data;
          var total = 0;
          var tarValue;
          for (var i = 0, l = data.length; i < l; i++) {
            total += data[i].value;
            if (data[i].name == name) {
              tarValue = data[i].value;
            }
          }

          var p = ((tarValue));

          var arr = [
            '{a|' + name + '}',
            '{b|' + p + '}',
          ]
          return arr.join(' ')
          //return name + " " + " " + p ;
        },

        //data:['B1','F1','F2']
      },

      // 颜色对应排序：IV(红) → III(橙) → II(黄) → I(蓝)
      color: ['#ff0000', '#ffc000', '#ffff00', '#00b0f0'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          center: ['25%', '50%'],
          itemStyle: {
            borderWidth: 2,	//边框的宽度
            borderColor: '#494a5f'	//边框的颜色
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              /*formatter:function(e){
                  return '4000 \n 总面积（亩）'
              },
              textStyle: {
                  color: '#fff',  // 改变标示文字的颜色
                  fontSize: 20
              }*/
              formatter: '{name|' + res.result.reduce((a, b) => a + b.countNums, 0) + '}\n{time|总计}',
              backgroundColor: 'rgba(25,255,252,0.05)',
              borderColor: '#19FFFC',
              borderWidth: 1,
              borderRadius: 300,
              borderType: 'solid', // solid dotted dashed
              width: 55,
              height: 55,
              padding: 5,
              rich: {
                name: {
                  fontSize: 17,
                  color: '#19FFFC',
                  lineHeight: 35,
                  fontWeight: 'bold'
                },
                time: {
                  fontSize: 11,
                  color: '#fff'
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: series,
          // data:[{"value":"94","name":"Ⅰ"},{"value":"316","name":"Ⅱ"},{"value":"259","name":"Ⅲ"},{"value":"170","name":"Ⅳ"},{"value":"20","name":"Ⅴ"}]
        },
        {

          type: 'pie',
          avoidLabelOverlap: true,
          radius: ['75%', '75%'],//边框大小
          center: ['25%', '50%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.5,//设置边框粗细
                borderColor: 'rgb(25,255,252, 1)',//边框颜色
                borderType: "dashed",//虚线
              }
            }
          }]
        },
      ]
    };
    disease_risk_chart.setOption(disease_risk_option);

    //点击触发事件
    disease_risk_chart.on('click', function (params) {
      if (params.data.name == "I级") {
        params.data.name = 1;
      }
      if (params.data.name == "II级") {
        params.data.name = 2;
      }
      if (params.data.name == "III级") {
        params.data.name = 3;
      }
      if (params.data.name == "IV级") {
        params.data.name = 4;
      }

      // 方法1：URI组件编码方案（兼容性好）
      const encodedURI = encodeURIComponent(params.data.name)
        .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );
      console.log('点击了系列', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'level' } });
      callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'level' } });
    });

  }).catch(err => {
    console.error('获取病害风险等级失败1:', err)
  });


  //病害风险等级end


  //病害治理情况
  get_disease_fixed().then(res => {
    const series = res.result.map(item => ({

      name: item['countName'], // 分类名称
      value: item['countNums'] // 转换为数值型 [16,53,110]

    }));
    console.log('dfdsfsdaf', series);

    var disease_fixed_chart = echarts.init(disease_fixed.value);
    const disease_fixed_option = {
      tooltip: {
        trigger: 'item',
        formatter: function (c) {

          return '<span style="display: inline-block;padding: 5px 0;" >' +
            '<i style="display: inline-block;border-radius:50%;width: 10px;height: 10px;background: ' + c.color +
            ';}"></i> ' +
            '<span style="margin-right:5px;">' + c.name + '</span>' + c.percent + '%' +
            '</span>';
        }
      },

      legend: {
        selectedMode: false,
        orient: 'vertical',
        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        x: 190,
        y: 70,
        itemGap: 15,
        textStyle: { //图例文字的样式
          color: '#fff',
          fontSize: 12,
          rich: {
            a: {
              fontSize: 12,
              verticalAlign: 'top',
              align: 'left',
              width: 10,
              color: '#A7D0EA',
              //padding:[0,0,28,0]
            },
            b: {
              fontSize: 12,
              align: 'right',
              width: 80,
              padding: [0, 0, 0, 0],
              color: '#19FFFC',
              //lineHeight:25
            }
          }
        },
        // 使用回调函数
        formatter: function (name) {
          var data = disease_fixed_option.series[0].data;
          var total = 0;
          var tarValue;
          for (var i = 0, l = data.length; i < l; i++) {
            total += data[i].value;
            if (data[i].name == name) {
              tarValue = data[i].value;
            }
          }

          var p = ((tarValue));

          var arr = [
            '{a|' + name + '}',
            '{b|' + p + '}',
          ]
          return arr.join(' ')
          //return name + " " + " " + p ;
        },

        //data:['B1','F1','F2']
      },

      color: ['#9ffd9d', '#ffc87b', '#ffc000', '#ff0000'],
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '65%'],
          avoidLabelOverlap: true,
          center: ['25%', '50%'],
          itemStyle: {
            borderWidth: 2,	//边框的宽度
            borderColor: '#494a5f'	//边框的颜色
          },
          label: {
            normal: {
              show: true,
              position: 'center',
              /*formatter:function(e){
                  return '4000 \n 总面积（亩）'
              },
              textStyle: {
                  color: '#fff',  // 改变标示文字的颜色
                  fontSize: 20
              }*/
              formatter: '{name|' + res.result.reduce((a, b) => a + b.countNums, 0) + '}\n{time|总计}',
              backgroundColor: 'rgba(25,255,252,0.05)',
              borderColor: '#19FFFC',
              borderWidth: 1,
              borderRadius: 300,
              borderType: 'solid', // solid dotted dashed
              width: 55,
              height: 55,
              padding: 5,
              rich: {
                name: {
                  fontSize: 17,
                  color: '#19FFFC',
                  lineHeight: 35,
                  fontWeight: 'bold'
                },
                time: {
                  fontSize: 11,
                  color: '#fff'
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: series,
          // data:[{"value":"94","name":"Ⅰ"},{"value":"316","name":"Ⅱ"},{"value":"259","name":"Ⅲ"},{"value":"170","name":"Ⅳ"},{"value":"20","name":"Ⅴ"}]
        },
        {

          type: 'pie',
          avoidLabelOverlap: true,
          radius: ['75%', '75%'],//边框大小
          center: ['25%', '50%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 1,
            itemStyle: {
              normal: {
                borderWidth: 0.5,//设置边框粗细
                borderColor: 'rgb(25,255,252, 1)',//边框颜色
                borderType: "dashed",//虚线
              }
            }
          }]
        },
      ]
    };
    disease_fixed_chart.setOption(disease_fixed_option);

    //点击触发事件
    disease_fixed_chart.on('click', function (params) {

      // 方法1：URI组件编码方案（兼容性好）
      const encodedURI = encodeURIComponent(params.data.name)
        .replace(/%([0-9A-F]{2})/g, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        );
      console.log('点击了系列', { "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'status' } });
      callParentMethod({ "code": 1, "type": "poi", "data": { "id": btoa(encodedURI), "state": 'status' } });
    });

  }).catch(err => {
    console.error('治理情况error:', err)
  });




  //病害治理情况end


  //每公里
  get_road_kilometer().then(res => {
    const years = [];
    const kilval = [];
    console.log('每公里数据', res.result);
    res.result.forEach(item => {
      years.push(item.year)
      kilval.push((item.bhtNums / item.chedaomile).toFixed(2))
    });
    console.log('每公里数据1', kilval);

    var disease_kilometers_chart = echarts.init(disease_kilometers.value);
    const disease_kilometers_option = {
      // title: {
      //     text: 'Stacked Area Chart'
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      // legend: {
      //     data: ['故障', '隐患', '安全事件'],
      //     textStyle: { color: '#fff' }, // 图例文字颜色
      // },
      // toolbox: {
      //     feature: {
      //     saveAsImage: {}
      //     }
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0%',
        top: '10%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: '#fff' // 红色字体
            }
          },
          data: years
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#fff' // 红色字体
            }
          },
        }
      ],
      series: [
        {
          name: '',
          type: 'line',
          stack: 'Total',
          smooth: true,  // 关键参数
          showSymbol: false,  // 不显示数据点
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
                },
                {
                  offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
                },
                {
                  offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
                }
              ]
              ),  //背景渐变色
            },
          },
          emphasis: {
            focus: 'series'
          },
          // 配置折线的样式
          lineStyle: {
            color: '#0090ff' // 折线颜色设置为红色
          },

          data: kilval
        },
        // {
        // name: '隐患',
        // type: 'line',
        // stack: 'Total',
        // smooth: true,  // 关键参数
        // showSymbol: false,  // 不显示数据点
        // areaStyle: {
        //     normal: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //         offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
        //     },
        //     {
        //         offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
        //     },
        //     {
        //         offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
        //     }
        //     ]
        //     ),  //背景渐变色
        //     },
        // },
        // emphasis: {
        //     focus: 'series'
        // },
        // // 配置折线的样式
        // lineStyle: {
        //     color: '#f0ff00' // 折线颜色设置为红色
        // },
        // data: [220, 182, 191, 234, 290, 330, 310]
        // },
        // {
        // name: '安全事件',
        // type: 'line',
        // stack: 'Total',
        // smooth: true,  // 关键参数
        // showSymbol: false,  // 不显示数据点
        // areaStyle: {
        //     normal: {
        //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //         offset: 0, color: 'rgba(177,222,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
        //     },
        //     {
        //         offset: 0.8, color: 'rgba(177,222,255,0.1) ' // 100% 处的颜色
        //     },
        //     {
        //         offset: 1, color: 'rgba(177,222,255,0) ' // 100% 处的颜色
        //     }
        //     ]
        //     ),  //背景渐变色
        //     },
        // },
        // emphasis: {
        //     focus: 'series'
        // },
        // // 配置折线的样式
        // lineStyle: {
        //     color: '#f29556' // 折线颜色设置为红色
        // },
        // data: [150, 232, 201, 154, 190, 330, 410]
        // },

      ]
    };
    disease_kilometers_chart.setOption(disease_kilometers_option);
  }).catch(err => {
    console.error('每公里失败1:', err)
  });


  //每公里end


  // // //获取数据列表get
  // await getUserList().then(res => {
  //     console.log('用户列表数据:', res.data)
  //     chartRef_data.value  = res.data;
  // }).catch(err => {
  //     console.error('请求失败1:', err)
  // });

  // // //获取数据列表post
  // await createUser().then(res => {
  //     console.log('post列表数据:', res)
  // }).catch(err => {
  //     console.error('post请求失败2:', err)
  // });

  // var energy_generation_district_val=chartRef_data.value.generate_year || [];
  // //地磅出货指数
  // var energy_generation_district_time;
  // //动态柱状图
  // var myChart = echarts.init(chartRef.value);
  // // 数据名
  // var dataAxis2 = chartRef_data.value.xaxis || [];
  // // 数据值
  // var data2 = energy_generation_district_val;
  // var yMax2 = 100;
  // var dataShadow2 = [];
  // for (var i = 0; i < data2.length; i++) {
  //     dataShadow2.push(yMax2);
  // }
  //   // 初始化 ECharts 实例
  // //   const myChart = echarts.init(chartRef.value);

  //   // 简单柱状图配置
  //   const option = {
  //     legend: {
  //         orient: 'vertical',
  //         x: 'right',
  //         textStyle: { //图例文字的样式
  //             color: '#fff',
  //             fontSize: 10
  //         },

  //     },
  //     tooltip : {
  //     trigger: 'axis',
  //     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
  //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
  //     }
  //     },
  //     // title: { text: '首页数据统计' },
  //     grid: {
  //     top:'20',
  //     left: '3%',
  //     right: '4%',
  //     bottom: '20',
  //     containLabel: true
  //     },
  //     xAxis: {
  //         data: dataAxis2,
  //         axisLabel: {
  //             interval: 0,
  //             textStyle: {
  //                 color: '#1ba2f2'
  //             }
  //         },
  //         axisTick: {
  //             show: false
  //         },
  //         axisLine: {
  //             show: false
  //         },
  //         z: 10,
  //     },
  //     yAxis: [{
  //         axisLabel: {
  //             interval: 0,
  //             textStyle: {
  //                 color: '#1ba2f2'
  //             }
  //         },
  //         axisLine: {
  //             lineStyle: {
  //                 type: 'solid',
  //                 color:'#fff',
  //                 width:1
  //             }
  //         },
  //         splitLine: {
  //             show: true,
  //             lineStyle: {
  //                 color: '#1ba2f2' // X轴分割线颜色为红色
  //             }
  //         }
  //     }],
  //     series: [
  //         {
  //             type: 'line',
  //             smooth: false,
  //             // 拐点设置为实心
  //             symbol: 'circle',
  //             // 拐点大小
  //             symbolSize: 12,
  //             barWidth: "50%",
  //             // 添加渐变
  //             itemStyle: {
  //                 normal: {
  //                     // 拐点颜色
  //                     color: 'rgba(255,255,255,0)',
  //                     // 拐点边框颜色
  //                     borderColor: '#3ae8e2 ',
  //                     // 拐点边框大小
  //                     borderWidth: 0,
  //                     //折线颜色
  //                     lineStyle:{
  //                         color:"#3ae8e2"  //EB8C1D
  //                     },

  //                 },
  //                 emphasis: {          //突出效果配置(鼠标置于拐点上时)
  //                     borderColor: '#3ae8e2',    //  拐点边框颜色  EB8C1D
  //                     borderWidth: 4,         //  拐点边框宽度
  //                     /*shadowColor: '#c00', //  阴影颜色
  //                     shadowBlur: 3,          //  阴影渐变范围控制*/
  //                     color: '#fff'//hover拐点颜色定义
  //                 },
  //             },
  //             data: data2,
  //             //柱状图上显示数据
  //             label: {
  //                 show: false,
  //                 position: "top",
  //                 color: "#FFF",
  //                 fontWeight: "bolder",
  //                 fontSize: "12"
  //             },
  //             //面积颜色
  //             areaStyle: {
  //                 normal: {
  //                     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //                         {
  //                             offset: 0, color: 'rgba(58,232,226,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
  //                         },
  //                         {
  //                             offset: 0.5, color: 'rgba(58,232,226,0.1) ' // 100% 处的颜色
  //                         },
  //                         {
  //                             offset: 1, color: 'rgba(58,232,226,0) ' // 100% 处的颜色
  //                         }
  //                     ]
  //                     ),  //背景渐变色
  //                 },
  //             },
  //         }
  //     ]
  //   };

  //   myChart.setOption(option);


  //案例2柱状图
  // var myChart2 = echarts.init(chart2.value);
  // const option2 = {
  // color: ['#3398DB'],
  // /*title: {

  // subtext: '数量/天',
  // subtextStyle: {
  // color: '#fff'
  // },
  // padding: [5, 0, 10, 0]  // 位置
  // },*/
  // tooltip : {
  // trigger: 'axis',
  // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
  // type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
  // }
  // },
  // grid: {
  // top:'20',
  // left: '3%',
  // right: '4%',
  // bottom: '20',
  // containLabel: true
  // },
  // xAxis : [
  // {
  // type : 'category',
  // data : ["住院楼","门急诊大楼","行政楼","门急诊综合楼","肝科楼","特需楼"],
  // axisTick: {
  // alignWithLabel: true
  // },
  // axisLabel: {
  // interval: 0,
  // textStyle: {
  // color: '#1ba2f2'
  // }
  // },
  // axisLine: {
  // lineStyle: {
  // type: 'solid',
  // color:'#fff',
  // width:'1'
  // }
  // },
  // }
  // ],
  // yAxis : [
  // {
  // type : 'value',
  // axisLabel: {
  // interval: 0,
  // textStyle: {
  // color: '#1ba2f2'
  // }
  // },
  // axisLine: {
  // lineStyle: {
  // type: 'solid',
  // color:'#1ba2f2',
  // width:'1'
  // }
  // },
  // splitLine: {
  // show: true,
  // lineStyle: {
  // color: '#1ba2f2' // X轴分割线颜色为红色
  // }
  // }
  // }
  // ],
  // series : [
  // {
  // name:'费用',
  // type:'bar',
  // barWidth: '30%',
  // data:[10,20,30,40,50,60],
  // animationDelay: function(idx) {
  // return idx * 500;
  // },
  // itemStyle: {
  // normal: {
  // //每根柱子颜色设置
  // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  // { offset: 0, color: 'rgba(179, 255, 252,1)' },
  // { offset: 0.4, color: 'rgba(116, 255, 249,1)' },
  // { offset: 1, color: 'rgba(64, 255, 247,1)' }
  // ]),
  // label: {
  // show: false, //开启显示
  // position: 'top', //在上方显示
  // textStyle: { //数值样式
  // color: '#ffffff',
  // fontSize: 12
  // }
  // },

  // }
  // },
  // }
  // ]
  // };
  // // 使用刚指定的配置项和数据显示图表。

  // myChart2.setOption(option2);
});
</script>