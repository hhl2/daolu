<!--检测-->
<template>
  <div class="process_box">
    <div class="process_box_top">
      <div class="process_chart_position" style="margin-right:20px;">
        <div class="tc_box">
          <div class="tc_left">本期病害类型及数量</div>
          <div class="tc_right">
            <el-icon @click="goToHome">
              <CloseBold/>
            </el-icon>
          </div>
        </div>
        <div ref="disease_type" class="chart-container" style="height: 200px;"></div>
      </div>
      <div class="process_position">
        <div class="tc_box">
          <div class="tc_left">{{ selectDiv=='dispose'?'处置列表':
            (selectDiv=='inspection'?'巡检列表':'检测列表')}}</div>
          <div class="tc_right">
            <el-icon @click="goToHome">
              <CloseBold/>
            </el-icon>
          </div>
        </div>

        <div class="roadlist_table">
          <!-- 搜索区域 -->
          <div class="search-box">
            <el-input
                v-model="searchText"
                placeholder="请输入道路名称"
                clearable
                @keyup.enter="handleSearch"
                style="width: 300px; margin-right: 15px">
            </el-input>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </div>

          <!-- 表格区域 -->
          <el-table
              :data="tableData"
              border
              v-loading="loading"
              style="width: 100%"
              height="280">
            <el-table-column prop="follow_up_user_name" label="序号" width="50">
              <template #default="scope">
                {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column prop="roadName" label="道路名称" width="100" show-overflow-tooltip="true">
              <template #default="scope">
                <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
                <a
                    href="javascript:void(0)"
                    @click="disastercodeclick(scope.row.roadName,'daolu')"
                >
                  {{ scope.row.roadName }}
                </a>
              </template>

            </el-table-column>
            <el-table-column prop="surveyDate" label="检测时间" width="100" show-overflow-tooltip="true"/>
            <el-table-column prop="allbhnums" label="病害数量"/>
            <el-table-column prop="riskLevel" label="风险等级">
              <template #default="{ row }">
                        <span :class="[
                                row.riskLevel === '1' ? 'risk-level-1' :
                                row.riskLevel === '2' ? 'risk-level-2' :
                                row.riskLevel === '3' ? 'risk-level-3' :
                                row.riskLevel >= '4' ? 'risk-level-4' : ''
                            ]">
                            {{ row.riskLevel_dictText }}
                            </span>
              </template>
            </el-table-column>
            <el-table-column v-if="selectDiv=='dispose'" prop="waitfixnums" label="待处置">
            </el-table-column>
            <el-table-column v-if="selectDiv=='dispose'" prop="sstnums" label="不需处置">
            </el-table-column>
            <el-table-column v-if="selectDiv=='dispose'" prop="fixednums" label="已处置">
            </el-table-column>
            <el-table-column v-if="selectDiv=='inspection'" prop="xjnums" label="巡检总数">
            </el-table-column>
            <el-table-column v-if="selectDiv=='inspection'" prop="changednums" label="未变化">
            </el-table-column>
            <el-table-column v-if="selectDiv=='inspection'" prop="nochangednums" label="有变化">
            </el-table-column>

            <!-- <el-table-column v-if="selectDiv=='detection'" prop="sysAreaRoad.roadCsdlLevel" label="道路等级"/> -->
            <el-table-column v-if="selectDiv=='detection'" prop="sysAreaRoad.checkNum" label="检测情况">
              <template #default>
                已检测
                <!-- {{scope.row.sysAreaRoad.checkNum}}次 -->
              </template>
            </el-table-column>
            <el-table-column v-if="selectDiv=='detection'" prop="follow_up_user_name" label="信息卡">
              <template #default="scope">
                <!-- 假设当前行数据中有 imgUrl 字段存储图片地址 -->
                <a
                    href="javascript:void(0)"
                    @click="handleClick(scope.row.roadName)"
                >
                  详情
                </a>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页控件 -->
          <el-pagination style="margin-top:15px;"
                         v-model:current-page="currentPage"
                         v-model:page-size="pageSize"
                         small
                         :pager-count="5"
                         :page-sizes="[10, 20, 30, 50]"
                         :background="true"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
          />
        </div>

      </div>

    </div>

    <div class="process_lc_position">
      <div class="tc_box">
        <div class="tc_left">流程管理-{{projectInfo.projectName}}</div>
        <div class="tc_right">
          <el-icon @click="goToHome">
            <CloseBold/>
          </el-icon>
        </div>
      </div>
      <div class="process_lc">
        <div class="process_lc_text" @click="godetection">
          <div class="process_lct_title">
            检测
          </div>
          <div class="process_lct_content">
            <p>工期：{{ projectInfo.duration }}</p>
            <p>进度：{{ projectInfo.duration }}/{{ usedDays > projectInfo.duration ? projectInfo.duration : usedDays }}/{{
                progress
              }}%</p>
            <p>病害：{{ projectInfo.allbhnums }}</p>
          </div>
        </div>
        <div><img src="@/assets/jt.png"/></div>
        <div class="process_lc_text" @click="godispose">
          <div class="process_lct_title">
            处置
          </div>
          <div class="process_lct_content">
            <p>已处置：{{ projectInfo.fixednums }}</p>
            <p>待处置：{{ projectInfo.waitfixnums }}</p>
            <p>不需处置：{{ projectInfo.sstnums }}</p>
          </div>
        </div>
        <div><img src="@/assets/jt.png"/></div>
        <div class="process_lc_text" @click="goinspection">
          <div class="process_lct_title">
            巡检
          </div>
          <div class="process_lct_content">
            <p>总数：{{ projectInfo.xjnums }}</p>
            <p>有变化：{{ projectInfo.changednums }}</p>
            <p>未变化：{{ projectInfo.nochangednums }}</p>
          </div>
        </div>
      </div>

    </div>

    <!-- 放大图片 -->
    <el-dialog @closed="handleDialogClose" v-model="dialogVisible" width="50%" style="text-align:center;">
      <router-view name="detection"></router-view>
    </el-dialog>
  </div>
</template>
<style></style>
<script>
export default {
  name: 'ProjectProcess' // 改为多单词名称
}
</script>

<script setup>
import * as echarts from 'echarts';
import {inject, ref, onMounted, watch, computed} from 'vue'
import { get_disease_type, get_xiangmu, get_xiangmu_daolu} from '@/api/user'
import {useRoute, useRouter} from 'vue-router';

const route = useRoute();
const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};

var disease_type = ref('disease_type'); // 创建图表容器的 ref
const selectDiv = ref('detection');
//工程的信息
const projectInfo = ref({id:'',projectName:''});

const godetection = () => {
  selectDiv.value = 'detection';
  //统计图1
  getTongji1();
};
const godispose = () => {
  selectDiv.value = 'dispose';
  //统计图2

  getTongji2();
};
const goinspection = () => {
  selectDiv.value = 'inspection';
  //统计图3
  getTongji3();
 };

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

//点击图片放大弹窗
const dialogVisible = ref(false);
// 监听路由变化控制弹窗
watch(
    () => route.name,
    (newVal) => {
      dialogVisible.value = newVal === 'detection_modal' // 根据子路由激活状态控制弹窗
    },
    {immediate: true}
)
// 弹窗关闭时清理路由
const handleDialogClose = () => {
  router.push({name: 'detection'}) // 返回父路由
}
const handleClick = (item) => {
  localStorage.setItem('roadinfo', JSON.stringify({id: item}))
  router.push({
    name: 'detection_modal', // 使用子路由名称
    query: {id: item} // 可选参数
  })
} 
 

//计算进度
const now = ref(Date.now())
const progress = computed(() => {
  const startTime = new Date(projectInfo.value.startDate).getTime()
  const endTime = new Date(projectInfo.value.finishDate).getTime()
  const current = now.value
  // 处理边界情况
  if (current >= endTime) return 100
  if (current <= startTime) return 0

  return ((current - startTime) / (endTime - startTime) * 100).toFixed(1)
})
const usedDays = computed(() =>
    Math.max(0, Math.floor((now.value - new Date(projectInfo.value.startDate)) / 86400000))
)


// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)

// 获取检测项目的道路数据
const fetchData = async () => {
  try {
    loading.value = true
    //由于数据的问题，所以设置项目id是空，找所有项目的数据
    get_xiangmu_daolu({projectId:projectInfo.value.id,current: currentPage.value, pagesize: pageSize.value, searchtext: searchText.value}).then(res => {
      tableData.value = res.result.records
      total.value = res.result.total
      currentPage.value = res.result.current
      // pageSize.value = res.result.size
    }).catch(err => {
      console.error('最近项目的检测道路请求失败:', err)
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
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  fetchData()
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  fetchData()
}

//病害类型及数量

//统计1
const getTongji1 = ()=>{

  var disease_type_chart = echarts.init(disease_type.value);
  get_disease_type({projectId: projectInfo.value.id}).then(res => {
    console.log('病害数量:', res)
    // 病害类型排序：空洞(红) → 脱空(橙) → 疏松体(黄)，危害由重到轻
    const typeOrder = ['空洞', '脱空', '疏松体'];
    const typeColorMap = {
      '空洞': '#ff0000',
      '脱空': '#ffc000',
      '疏松体': '#ffff00'
    };
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
          acc.push({
            name: '疏松体', 
            value,
            itemStyle: { color: typeColorMap['疏松体'] }
          });
        }
      } else {
        // 其他分类直接添加
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
        y: 60,
        itemGap: 15,
        textStyle: { //图例文字的样式
          color: '#fff',
          fontSize: 16,
          rich: {
            a: {
              fontSize: 16,
              verticalAlign: 'top',
              align: 'left',
              width: 10,
              color: '#A7D0EA',
              //padding:[0,0,28,0]
            },
            b: {
              fontSize: 16,
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


    });
  }).catch(err => {
    console.error('获取病害类型及数量失败1:', err)
  });
}
const getTongji2=()=>{

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
      y: 60,
      itemGap: 15,
      textStyle: { //图例文字的样式
        color: '#fff',
        fontSize: 16,
        rich: {
          a: {
            fontSize: 16,
            verticalAlign: 'top',
            align: 'left',
            width: 10,
            color: '#A7D0EA',
            //padding:[0,0,28,0]
          },
          b: {
            fontSize: 16,
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

    color: ['#4ffdc2', '#18ffff', '#188fff', '#ffb32e', '#e72eff',],
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
            formatter: '{name|' + (parseInt(projectInfo.value.fixednums, 10) + parseInt(projectInfo.value.waitfixnums, 10) + parseInt(projectInfo.value.sstnums, 10)) + '}\n{time|总计}',
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
                fontSize: 10,
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
        data: [{"value": projectInfo.value.fixednums, "name": "已处置"}, {
          "value": projectInfo.value.waitfixnums,
          "name": "待处置"
        }, {"value": projectInfo.value.sstnums, "name": "不需处置"}]
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
}
const getTongji3=()=>{

  var disease_type_chart = echarts.init(disease_type.value);
  //病害类型及数量
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
      y: 75,
      itemGap: 15,
      textStyle: { //图例文字的样式
        color: '#fff',
        fontSize: 16,
        rich: {
          a: {
            fontSize: 16,
            verticalAlign: 'top',
            align: 'left',
            width: 10,
            color: '#A7D0EA',
            //padding:[0,0,28,0]
          },
          b: {
            fontSize: 16,
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

    color: ['#4ffdc2', '#18ffff', '#188fff', '#ffb32e', '#e72eff',],
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
            formatter: '{name|' + (projectInfo.value.changednums + projectInfo.value.nochangednums) + '}\n{time|总计}',
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
                fontSize: 14,
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
        data: [{"value": projectInfo.value.changednums, "name": "有变化"}, {
          "value": projectInfo.value.nochangednums,
          "name": "未变化"
        }]
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
}
// 初始化加载
onMounted(async () => {

  await get_xiangmu({}).then(res=>{
    console.log("所有的项目，按开始时间倒序"+res.result.records);
    if(res.result.records){
      let project = res.result.records[0];
      //最近一期的项目
      projectInfo.value = project;
      console.log("最近一期的项目"+ JSON.stringify(project));
      //本期检测的道路表
      fetchData();
      getTongji1();
  }});

  //病害类型及数量end
})


</script>