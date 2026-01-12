<template>
  <div class="roadlist_table" style="display:flex;justify-content: space-between;">
    <div>
      <div style="font-size:14px;color:#fff;margin-bottom:5px;">净深(m)</div>
      <div ref="disease_jing" class="chart-container"
           style="width:280px;height: 280px;background:rgba(21,57,80,0.8);padding:5px;margin-right:10px;"></div>
    </div>
    <div>
      <div style="font-size:14px;color:#fff;margin-bottom:5px;">埋深(m)</div>
      <div ref="disease_mai" class="chart-container"
           style="width:280px;height: 280px;background:rgba(21,57,80,0.8);padding:5px;margin-right:10px;"></div>
    </div>
    <div>
      <div style="font-size:14px;color:#fff;margin-bottom:5px;">面积(m²)</div>
      <div ref="disease_mianji" class="chart-container"
           style="width:280px;height: 280px;background:rgba(21,57,80,0.8);padding:5px;"></div>
    </div>


  </div>

</template>

<script setup>
import {onMounted, ref} from 'vue'
import * as echarts from 'echarts';
import { get_disease_repeat} from '@/api/user'

//净深
var disease_jing = ref(null);
// 埋深
var disease_mai = ref(null);
// 面积
var disease_mianji = ref(null);

 
var js = ref(['1'])
var ms = ref(['1'])
var mj = ref(['1'])
var rq = ref(['1月'])
// 获取数据（真实API调用）
const fetchData = async () => {
  try { 

  var diseasedata = localStorage.getItem('diseasetrack');  
  const diseaseinfo = diseasedata ? JSON.parse(diseasedata) : null;
      await get_disease_repeat({hiscode: diseaseinfo.id}).then(rr => { 
        js.value = [];
        ms.value = [];
        mj.value = [];
        rq.value = [];
        for(let i=0;i<rr.result.records.length;i++){
          js.value.push(rr.result.records[i].depth)
          ms.value.push(rr.result.records[i].sfthd)
          mj.value.push(rr.result.records[i].square)
          rq.value.push(rr.result.records[i].reportDate)
        }
        console.log('病害复测情况i:', rr.result.records)
      }).catch(err => {
        console.error('病害复测情况i请求失败1:', err)
      });



  } finally { 
     drawjichart();
     drawmaichart();
     drawmjchart();
  }
}
const drawjichart = () => {

  //净深
  var disease_jing_chart = echarts.init(disease_jing.value);
  const disease_jing_option = {
    // title: {
    //     text: 'Stacked Area Chart'
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#ffdf00'
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
      top: '11%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        data: rq.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'm',
        nameTextStyle: { // 名称的文本样式
          color: '#9bccef',
          fontSize: 14
        },
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        splitLine: { // 分隔线
          show: true, // 是否显示分隔线
          lineStyle: {
            color: '#134c6d', // 分隔线颜色
            type: 'solid' // 分隔线类型，'solid' 或 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        stack: 'Total',
        smooth: true,  // 关键参数
        showSymbol: true,  // 不显示数据点
        // 设置折线点的样式
        itemStyle: {
          color: '#ffdf00' // 设置折线点的颜色为红色
        },

        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0, color: 'rgba(255,224,6,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
                  },
                  {
                    offset: 0.8, color: 'rgba(255,224,6,0.1) ' // 100% 处的颜色
                  },
                  {
                    offset: 1, color: 'rgba(255,224,6,0) ' // 100% 处的颜色
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
          color: '#ffdf00' // 折线颜色设置为红色
        },

        data: js.value
      },


    ]
  };
  disease_jing_chart.setOption(disease_jing_option);
};
const drawmaichart = () => {

  //埋深
  var disease_mai_chart = echarts.init(disease_mai.value);
  const disease_mai_option = {
    // title: {
    //     text: 'Stacked Area Chart'
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#04ffcc'
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
      top: '11%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        data: rq.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'm',
        nameTextStyle: { // 名称的文本样式
          color: '#9bccef',
          fontSize: 14
        },
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        splitLine: { // 分隔线
          show: true, // 是否显示分隔线
          lineStyle: {
            color: '#134c6d', // 分隔线颜色
            type: 'solid' // 分隔线类型，'solid' 或 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        stack: 'Total',
        smooth: true,  // 关键参数
        showSymbol: true,  // 不显示数据点
        // 设置折线点的样式
        itemStyle: {
          color: '#04ffcc' // 设置折线点的颜色为红色
        },

        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0, color: 'rgba(4,255,204,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
                  },
                  {
                    offset: 0.8, color: 'rgba(4,255,204,0.1) ' // 100% 处的颜色
                  },
                  {
                    offset: 1, color: 'rgba(4,255,204,0) ' // 100% 处的颜色
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
          color: '#04ffcc' // 折线颜色设置为红色
        },

        data: ms.value
      },


    ]
  };
  disease_mai_chart.setOption(disease_mai_option);
};const drawmjchart = () => {

  //面积
  var disease_mianji_chart = echarts.init(disease_mianji.value);
  const disease_mianji_option = {
    // title: {
    //     text: 'Stacked Area Chart'
    // },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#007dff'
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
      top: '11%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        data: rq.value
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '㎡',
        nameTextStyle: { // 名称的文本样式
          color: '#9bccef',
          fontSize: 14
        },
        axisLine: { // 坐标轴线
          show: true, // 是否显示坐标轴线
          lineStyle: {
            color: '#33b2fb', // 坐标轴线的颜色
            width: 1 // 坐标轴线的宽度
          }
        },
        axisLabel: {
          textStyle: {
            color: '#9bccef' // 红色字体
          }
        },
        splitLine: { // 分隔线
          show: true, // 是否显示分隔线
          lineStyle: {
            color: '#134c6d', // 分隔线颜色
            type: 'solid' // 分隔线类型，'solid' 或 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: '',
        type: 'line',
        stack: 'Total',
        smooth: true,  // 关键参数
        showSymbol: true,  // 不显示数据点
        // 设置折线点的样式
        itemStyle: {
          color: '#007dff' // 设置折线点的颜色为红色
        },

        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0, color: 'rgba(0,125,255,0.5)' // 0% 处的颜色  rgba(235,140,29,0.5)
                  },
                  {
                    offset: 0.8, color: 'rgba(0,125,255,0.1) ' // 100% 处的颜色
                  },
                  {
                    offset: 1, color: 'rgba(0,125,255,0) ' // 100% 处的颜色
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
          color: '#007dff' // 折线颜色设置为红色
        },

        data: mj.value
      },


    ]
  };
  disease_mianji_chart.setOption(disease_mianji_option);
};
//生命周期
onMounted(async () => { 
  fetchData();
}); 

</script>

    