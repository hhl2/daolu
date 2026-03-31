<!--巡检-->
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
          <div class="tc_left">巡检列表</div>
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
            <el-table-column prop="sysAreaRoad.findBhtNum" label="病害数量"/>
            <el-table-column prop="sysAreaRoad.riskLevel" label="风险等级">
              <template #default="{ row }">
                        <span :class="[
                                row.sysAreaRoad.riskLevel === '1' ? 'risk-level-1' :
                                row.sysAreaRoad.riskLevel === '2' ? 'risk-level-2' :
                                row.sysAreaRoad.riskLevel === '3' ? 'risk-level-3' :
                                row.sysAreaRoad.riskLevel >= '4' ? 'risk-level-4' : ''
                            ]">
                            {{ toRoman(row.sysAreaRoad.riskLevel) }}
                            </span>
              </template>

            </el-table-column>
            <el-table-column prop="status_txt" label="总数">
              <template #default="{ row }">
                        <span v-if="repeatData[row.roadName] !== undefined">
                        {{ repeatData[row.roadName].allBh }}
                        </span>
              </template>
            </el-table-column>
            <el-table-column prop="follow_up_user_name" label="未变化">
              <template #default="{ row }">
                        <span v-if="repeatData[row.roadName] !== undefined">
                        {{ repeatData[row.roadName].noChanged }}
                        </span>
              </template>
            </el-table-column>
            <el-table-column prop="follow_up_user_name" label="有变化">
              <template #default="{ row }">
                        <span v-if="repeatData[row.roadName] !== undefined">
                        {{ repeatData[row.roadName].changed }}
                        </span>
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
        <div class="tc_left">流程管理</div>
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
            <p>工期：{{ jc_ary.duration }}</p>
            <p>进度：{{ jc_ary.duration }}/{{ usedDays > jc_ary.duration ? jc_ary.duration : usedDays }}/{{
                progress
              }}%</p>
            <p>病害：{{ jc_ary.findDisasters }}</p>
          </div>
        </div>
        <div><img src="@/assets/jt.png"/></div>
        <div class="process_lc_text" @click="godispose">
          <div class="process_lct_title">
            处置
          </div>
          <div class="process_lct_content">
            <p>已处置：{{ jc_result.fixed }}</p>
            <p>待处置：{{ jc_result.waitFix }}</p>
            <p>不需处置：{{ jc_result.sst }}</p>
          </div>
        </div>
        <div><img src="@/assets/jt.png"/></div>
        <div class="process_lc_text" @click="goinspection">
          <div class="process_lct_title">
            巡检
          </div>
          <div class="process_lct_content">
            <p>总数：{{ jc_result.allBh }}</p>
            <p>有变化：{{ jc_result.changed }}</p>
            <p>未变化：{{ jc_result.noChanged }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<style></style>
<script>
export default {
  name: 'ProcessInspection' // 改为多单词名称
}
</script>
<script setup>
import * as echarts from 'echarts';
import {inject, ref, onMounted, computed, reactive, watch} from 'vue'
import { get_lc,  get_xiangmu, get_xiangmu_daolu} from '@/api/user'
import {useRouter} from 'vue-router';

const router = useRouter();
const goToHome = () => {
  router.push('/');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};
const godetection = () => {
  router.push('/detection');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};
const godispose = () => {
  router.push('/dispose');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};
const goinspection = () => {
  router.push('/inspection');  // 假设首页路由为根路径:ml-citation{ref="6" data="citationList"}
};

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


//检测、处置、巡检变量
var jc_result = ref({})
//检测变量
var jc_ary = ref({})

//计算进度
const now = ref(Date.now())
const progress = computed(() => {
  const startTime = new Date(jc_ary.value.startDate).getTime()
  const endTime = new Date(jc_ary.value.finishDate).getTime()
  const current = now.value
  // 处理边界情况
  if (current >= endTime) return 100
  if (current <= startTime) return 0

  return ((current - startTime) / (endTime - startTime) * 100).toFixed(1)
})
const usedDays = computed(() =>
    Math.max(0, Math.floor((now.value - new Date(jc_ary.value.startDate)) / 86400000))
)

// 响应式数据
const searchText = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const total = ref(0)
const tableData = ref([])
const loading = ref(false)
const projectInfo = ref({id:'',projectName:''});
//病害类型及数量
var disease_type = ref(null); // 创建图表容器的 ref

// 获取数据（真实API调用）
const fetchData = async () => {
  try {
    loading.value = true

    await get_xiangmu({}).then(res=>{

      console.log("所有的项目，按开始时间倒序"+res.result.records);
      if(res.result.records){
        let project = res.result.records[1];
        //最近一期的项目
        projectInfo.value = project;
        console.log("最近一期的项目"+ JSON.stringify(project));
        //获取检测信息
        jc_ary.value = project;

        //获取 处置、巡检 的病害相关信息
        get_lc({projectId:project.id}).then(res => {
          console.log('检测、处置、巡检 的病害相关信息:', res)
          jc_result.value = res.result;

          //病害类型及数量
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
                    formatter: '{name|' + (jc_result.value.changed + jc_result.value.noChanged) + '}\n{time|总计}',
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
                data: [{"value": jc_result.value.changed, "name": "有变化"}, {
                  "value": jc_result.value.noChanged,
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
          //病害类型及数量end
        }).catch(err => {
          console.error('检测、处置、巡检 的病害相关信息请求失败1:', err)
        });

        //由于数据的问题，所以设置项目id是空，找所有项目的数据
        get_xiangmu_daolu({projectId:'',current: currentPage.value, pagesize: pageSize.value, searchtext: searchText.value}).then(res => {
          tableData.value = res.result.records
          total.value = res.result.total
          currentPage.value = res.result.current
          // pageSize.value = res.result.size
        }).catch(err => {
          console.error('最近项目的检测道路请求失败:', err)
        });

      }
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

// 初始化加载
onMounted(() => {
  fetchData();
})

//查询检测情况
// 响应式数据存储
const repeatData = reactive({})
const repeat_dis = async (hiscode) => {
  if (repeatData[hiscode]) return

  try {
    //获取路网列表
    get_lc({searchtext: hiscode}).then(res => {
      console.log('处置情况:', res)
      repeatData[hiscode] = res.result
    }).catch(err => {
      console.error('请求失败a:', err)
    });


  } catch (err) {
    console.error('获取 失败a:', err)
  }
}
// 自动触发加载逻辑
watch(() => tableData.value, (newVal) => {
  newVal.forEach(row => {
    repeat_dis(row.roadName)
  })
}, {immediate: true})
//查询复测情况end
</script>