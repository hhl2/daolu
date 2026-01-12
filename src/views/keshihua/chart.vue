<!--统计图表-->
<template>
  <div class="roadlist_box">
    <div class="tc_box">
      <div class="tc_left">统计图表</div>
      <div class="tc_right">
        <el-icon @click="goToHome">
          <CloseBold/>
        </el-icon>
      </div>
    </div>
    <div style="margin-top:0px;" class="chart_box">
      <div>
        <div class="title">病害类型及数量</div>
        <div ref="disease_type" class="chart-container" style="height: 200px;"></div>
      </div>
      <div>
        <div class="title">病害趋势</div>
        <div ref="disease_trends" class="chart-container" style="height: 200px;"></div>
      </div>
      <div>
        <div class="title">病害成因统计</div>
        <div ref="disease_cause" class="chart-container" style="height: 200px;"></div>
      </div>
      <div>
        <div class="title">病害风险等级</div>
        <div ref="disease_risk" class="chart-container" style="height: 200px;"></div>
      </div>
    </div>
  </div>
</template>
<style>
.chart_box {
  display: flex;
  flex-wrap: wrap;
}

.chart_box > div {
  width: calc(50% - 40px);
  margin: 20px;
}
</style>
<script>
export default {
  name: 'KeChart' // 改为多单词名称
}
</script>
<script setup>
import {onMounted, ref, computed} from 'vue'
import {useRouter} from 'vue-router';
import {get_cause, get_trends, get_disease_type, get_disease_level} from '@/api/user'
import * as echarts from 'echarts';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};


//病害类型及数量
var disease_type = ref(null); // 创建图表容器的 ref
//病害趋势
var disease_trends = ref(null); // 创建图表容器的 ref
//病害成因统计
var disease_cause = ref(null); // 创建图表容器的 ref
//病害风险等级
var disease_risk = ref(null); // 创建图表容器的 ref


//生命周期
onMounted(async () => {
  //病害类型及数量
  get_disease_type().then(res => {
    console.log('病害数量:', res)
    // const series = res.result.map(item => {
    //     return {
    //         name: item['countName'], // 分类名称
    //         value: item['countNums'] // 转换为数值型 [16,53,110]
    //     };
    // });
    const series = res.result.reduce((acc, item) => {
      const name = item['countName'];
      const value = parseInt(item['countNums']); // 转换为数值

      // 合并两类疏松体
      if (name === '严重疏松体' || name === '一般疏松体') {
        // 查找是否已存在疏松体分类
        const existing = acc.find(i => i.name === '疏松体');
        if (existing) {
          existing.value += value;
        } else {
          acc.push({name: '疏松体', value});
        }
      } else {
        // 其他分类直接添加
        acc.push({name, value});
      }

      return acc;
    }, []);
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },

      legend: {
        selectedMode: false,
        orient: 'vertical',
        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        x: 190,
        y: 25,
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

      color: ['#ffff00', '#00b0f0', '#ff0000', '#ffc000',],
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
    const series = res.result.slice(1).map(item => {
      return {
        name: item[0], // 分类名称
        type: 'line',
        smooth: true,  // 关键参数
        data: item.slice(1).map(Number) // 转换为数值型 [16,53,110]
      };
    });
    //步骤3：获取legend
    const legend = res.result.slice(1).map(item => {
      return item[0];
    });

    var disease_trends_chart = echarts.init(disease_trends.value);
    const disease_trends_option = {
      // title: {
      //     text: 'Stacked Area Chart'
      // },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
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
        textStyle: {color: '#fff'}, // 图例文字颜色
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
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
    const series = res.result.map(item => ({

      name: item['countName'], // 分类名称
      value: item['countNums'] // 转换为数值型 [16,53,110]

    })).sort((a, b) => {
      const order = ['I级', 'II级', 'III级', 'IV级'];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });
    console.log('病害风险等级:', series)
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
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },

      legend: {
        selectedMode: false,
        orient: 'vertical',
        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
        x: 210,
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

      color: ['#00b0f0', '#ffff00', '#ffc000', '#ff0000'],
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

  }).catch(err => {
    console.error('获取病害风险等级失败1:', err)
  });


  //病害风险等级end
})
</script>