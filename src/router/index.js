import { createRouter, createWebHashHistory } from 'vue-router'
import layout from '@/views/layout/index.vue'
import home from '@/views/home/index.vue'
import question from '@/views/home/question.vue'
import keshihua from '@/views/keshihua/index.vue'
import road from '@/views/home/road.vue'
import roadlist from '@/views/home/roadlist.vue'
import roadmap from '@/views/home/roadmap.vue'
import diseasemap from '@/views/home/diseasemap.vue'
import water from '@/views/home/water.vue'
import disease from '@/views/keshihua/disease.vue'
import diseaselist from '@/views/keshihua/diseaselist.vue'
import diseasetrack from '@/views/keshihua/diseasetracking.vue'
import chart from '@/views/keshihua/chart.vue'
import analysis from '@/views/keshihua/analysis.vue'
import detection from '@/views/process/detection.vue'
import dispose from '@/views/process/dispose.vue'
import inspection from '@/views/process/inspection.vue'
import severe from '@/views/yayy/severe.vue'
import planning from '@/views/yayy/planning.vue'
import ai from '@/views/ai/index.vue'
import monitor from '@/views/monitor/index.vue'
import yy from '@/views/yayy/yy.vue'
import yyinfo from '@/views/yayy/yyinfo.vue'
import pipe from '@/views/yayy/pipe.vue'
import sensor from '@/views/sensor/index.vue'
import ProjectProcess from  '@/views/process/projectprocess.vue'

import taxianlist from '@/views/keshihua/taxianlist.vue'

// 1. 定义路由规则:ml-citation{ref="2,3" data="citationList"}
const routes = [
  {
    path: '/',
    // name: 'home',
    component: layout,
    children:[
      {
        path: '',
        component: home,
      },
      //路网
      {
        path: 'road',
        component: road,
      },
      //路网
      {
        path: 'roadmap',
        component: roadmap,
      },
      //道路列表
      {
        path: 'road_list',
        name: 'road_list',
        component: roadlist,
        children: [
          {
            path: 'road',  // 实际路径变为 /road_list/road
            name: 'road_modal',  // 重命名避免冲突
            components: {
              road: () => import('@/views/home/road.vue') // 命名视图
            },
            meta: { hideParent: true } // 添加标记
          }
        ]
      },
      //病害热力图
      {
        path: 'disease_map',
        component: diseasemap,
      },
      //积水路段
      {
        path: 'water',
        component: water,
      },
      {
        path: 'keshihua',
        component: keshihua,
      },
      //病害
      {
        path: 'disease',
        component: disease,
      },
      //病害列表
      {
        path: 'diseaselist',
        name: 'diseaselist',
        component: diseaselist,
        children: [
          {
            path: 'disease',  // 实际路径变为 /road_list/road
            name: 'disease_modal',  // 重命名避免冲突
            components: {
              disease: () => import('@/views/keshihua/disease.vue') // 命名视图
            },
            meta: { hideParent: true } // 添加标记
          }
        ]
      },
      //病害追踪
      {
        path: 'diseasetrack',
        name: 'diseasetrack',
        component: diseasetrack,
        children: [
          {
            path: 'disease',  // 实际路径变为 /road_list/road
            name: 'diseasetrack_modal',  // 重命名避免冲突
            components: {
              disease: () => import('@/views/keshihua/diseasetrackmodel.vue') // 命名视图
            },
            meta: { hideParent: true } // 添加标记
          }
        ]
      },
      //统计图表
      {
        path: 'chart',
        component: chart,
      },
      //空间分析
      {
        path: 'analysis',
        component: analysis,
      },
      //检测
      {
        path: 'projectprocess',
        name: 'projectprocess',
        component: ProjectProcess

      },
      {
        path: 'detection',
        name: 'detection',
        component: detection,
        children: [
          {
            path: 'road',  // 实际路径变为 /road_list/road
            name: 'detection_modal',  // 重命名避免冲突
            components: {
              detection: () => import('@/views/home/road.vue') // 命名视图
            },
            meta: { hideParent: true } // 添加标记
          }
        ]
      },
      //处置
      {
        path: 'dispose',
        component: dispose,
      },
      //巡检
      {
        path: 'inspection',
        component: inspection,
      },
      //严重病害预演
      {
        path: 'severe',
        name: 'severe',
        component: severe,
        children: [
          {
            path: 'road',  // 实际路径变为 /road_list/road
            name: 'jc_modal',  // 重命名避免冲突
            components: {
              jc: () => import('@/views/home/road.vue') // 命名视图
            }
          },
          {
            path: 'disease',  // 实际路径变为 /road_list/road
            name: 'cz_modal',  // 重命名避免冲突
            components: {
              cz: () => import('@/views/keshihua/disease.vue') // 命名视图
            },
            meta: { hideParent: true } // 添加标记
          }
        ]
      },

      //预演
      {
        path: 'yy',
        name: 'yy',
        component: yy,
        children: [
          {
            path: 'disease',  // 实际路径变为 /road_list/road
            name: 'yydisease_modal',  // 重命名避免冲突
            components: {
              yydisease: () => import('@/views/keshihua/disease.vue') // 命名视图
            }
          },
          {
            path: 'road',  // 实际路径变为 /road_list/road
            name: 'yyroad_modal',  // 重命名避免冲突
            components: {
              yyroad: () => import('@/views/home/road.vue') // 命名视图
            }
          }
        ]
      },
      //病海预案弹窗
      {
        path: 'planning',
        component: planning,
      },
      //道路预案弹窗
      {
        path: 'yyinfo',
        component: yyinfo,
      },
      // Ai
      {
        path: 'ai',
        component: ai,
      },
      // 监控指挥
      {
        path: 'monitor',
        component: monitor,
      },
      //管道属性
      {
        path: 'pipe',
        component: pipe,
      },
      // 传感器
      {
        path: 'sensor',
        component: sensor,
      },

      //塌陷列表
      {
        path: 'taxianlist',
        name: 'taxianlist',
        component: taxianlist,
      },

    ]
  },
  {
    path: '/question',
    component: question,
  },

]

// 2. 创建路由实例:ml-citation{ref="2,4" data="citationList"}
const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { selector: to.hash }  // 处理锚点跳转干扰^[4][8]
  }
})

// 3. 全局前置守卫逻辑:ml-citation{ref="2,3" data="citationList"}
// 从环境变量或配置读取原始值（代码中不直接暴露）
// router.beforeEach((to, from, next) => {
//   // 判断当前路由是否已携带 `ss` 参数
//   if (!to.query.ss) {
//     // 创建合并后的查询参数对象:ml-citation{ref="4,6" data="citationList"}
//     const mergedQuery = { 
//       ...to.query, 
//       ss: 'ws://192.168.2.201:80' // 无需手动编码
//     }

//     // 触发带参数的路由跳转:ml-citation{ref="6" data="citationList"}
//     next({
//       path: to.path,
//       query: mergedQuery,
//       params: to.params
//     })
//   } else {
//     next()
//   }
// })

// const router = createRouter({
//   history: createWebHistory(process.env.VUE_APP_BASE_URL || '/'),
//   routes: [
//     {
//       path: '/',
//       // name: 'home',
//       component: layout,
//       children:[
//         {
//           path: '',
//           component: home,
//         },
//         //路网
//         {
//           path: 'road',
//           component: road,
//         },
//         //道路列表
//         {
//           path: 'road_list',
//           component: roadlist,
//         },
//         //病害热力图
//         {
//           path: 'disease_map',
//           component: diseasemap,
//         },
//         //积水路段
//         {
//           path: 'water',
//           component: water,
//         },
//         {
//           path: 'keshihua',
//           component: keshihua,
//         },
//         //病害
//         {
//           path: '/disease',
//           component: disease,
//         },
//         //病害列表
//         {
//           path: '/diseaselist',
//           component: diseaselist,
//         },
//         //病害追踪
//         {
//           path: '/diseasetrack',
//           component: diseasetrack,
//         },
//         //统计图表
//         {
//           path: '/chart',
//           component: chart,
//         },
//         //空间分析
//         {
//           path: '/analysis',
//           component: analysis,
//         },
//         //检测
//         {
//           path: '/detection',
//           component: detection,
//         },
//         //处置
//         {
//           path: '/dispose',
//           component: dispose,
//         },
//         //巡检
//         {
//           path: '/inspection',
//           component: inspection,
//         },
//         //严重病害预演
//         {
//           path: '/severe',
//           component: severe,
//         },
//         //检测规划预案
//         {
//           path: '/planning',
//           component: planning,
//         },
//       ]
//     },
//     {
//       path: '/question',
//       component: question,
//     },
  
//   ]
// })

export default router
