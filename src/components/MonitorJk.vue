<!--实时监控-->
<template>
  <div class="roadlist_table">
    <!-- 表格区域 -->
    <div class="info_box" style="margin-top:40px;">
      <el-descriptions class="margin-top" :data="tableData" :column="4" :size="size" :style="blockMargin">
        <el-descriptions-item>
          <el-select @change="handleCameraChange" v-model="camerano" placeholder="请选择" style="width: 240px">
            <el-option v-for="item in options" :key="item.id" :label="item.label" :value="item.id" />
          </el-select>
        </el-descriptions-item>
        <!-- <el-descriptions-item label="时间">2025/4/10</el-descriptions-item> -->
        <el-descriptions-item label="负责人">王小虎</el-descriptions-item>
        <el-descriptions-item label="联系电话">13789089098</el-descriptions-item>
      </el-descriptions>

    </div>
    <div style="display: flex; height: 450px; min-height: 300px;">
      <div style="flex: 1; display: flex; flex-direction: column;">
        <div id="camera1" style="flex: 1; border: 1px solid #ccc;"></div>
        <div id="camera2" style="flex: 1; border: 1px solid #ccc;"></div>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column;">
        <div id="camera3" style="flex: 1; border: 1px solid #ccc;"></div>
        <div id="camera4" style="flex: 1; border: 1px solid #ccc;"></div>
      </div>
      <div id="mapContainer" style="flex: 1; border: 1px solid #ccc; margin-left: 10px;">
        <!--        <img src="@/assets/cdmap.png" height="100%" width="100%"/>-->
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get_camera_list, get_car_position } from '@/api/user'
let player = [null, null, null, null];

// const play = () => {
//   player.play();
// };
//
// const stop = () => {
//   player.stop();
// };
//const selectedValue = ref('');
//const options = ref([]);
const camerano = ref('')
const options = [
]
const tableData = ref([])
const loading = ref(false)
const handleCameraChange = (value) => {
  console.log(value)
}
const destroy = (i) => {
  player[i].destroy();
  player[i] = null;
};
const initcamera = (i, cameraid, camerano) => {
  if (player[i]) {
    destroy();
  }
  console.group("mounted 组件挂载完毕状态===============》");
  try {

    player[i] = new window.EZUIKit.EZUIKitPlayer({
      id: cameraid, // 视频容器ID
      accessToken: localStorage.getItem("cameratoken"),
      url: "ezopen://open.ys7.com/" + camerano + "/1.hd.live",
      // simple: 极简版; pcLive: pc直播; pcRec: pc回放; mobileLive: 移动端直播; mobileRec: 移动端回放;security: 安防版; voice: 语音版;
      template: "pcLive",
      plugin: ["talk"], // 加载插件，talk-对讲 
      // language: "en", // zh | en
      handleError: (err) => {
        console.error("handleError", err);
      },
      // staticPath: "/ezuikit_static", // 如果想使用本地静态资源，请复制根目录下ezuikit_static 到当前目录下， 然后设置该值
      env: {
        // https://open.ys7.com/help/1772?h=domain
        // domain默认是 https://open.ys7.com, 如果是私有化部署或海外的环境，请配置对应的domain
        // The default domain is https://open.ys7.com If it is a private deployment or overseas (outside of China) environment, please configure the corresponding domain
        domain: "https://open.ys7.com",
      },
      // staticPath: "https://openstatic.ys7.com/ezuikit_js/v8.1.9/ezuikit_static",
      // 日志打印设置
      loggerOptions: {
        // player.setLoggerOptions(options)
        level: "INFO", // INFO LOG  WARN  ERROR
        name: "ezuikit",
        showTime: true,
      },
    });
  } catch (e) {
    console.log('摄像头链接出问题了');
  }
};
let map = null;
let marker = null;
let trackPoints = [];  // 存储历史轨迹点
let trackPolyline = null;  // 轨迹折线对象
const initMap = () => {
  // 确保DOM元素已经加载完毕
  const mapContainer = document.querySelector('#mapContainer');
  if (mapContainer && !map) {
    map = new window.T.Map(mapContainer);
    const point = new window.BMapGL.Point(113.459749, 23.106402);
    map.centerAndZoom(point, 11);
    map.enableScrollWheelZoom(); //开启鼠标滚轮缩放
  }
  setInterval(function () {
    if (!map) {
      syncCarPostion()
    }
  }, 2000);
}
//同步车辆位置
const syncCarPostion = async () => {
  get_car_position({}).then(json => {
    if (json.code == 0) {
      var result = json.result;
      console.log('car: ' + JSON.stringify(result));
      let longitude = result.convertLongitude;
      let latitude = result.convertLatitude;
      // 创建当前坐标点
      let newPoint = new window.T.LngLat(longitude, latitude);

      // 更新地图中心（可选）
      // me.win2ChartObj.map.centerAndZoom(newPoint, me.win2ChartObj.map.getZoom());
      // 屏蔽自动跳转，防止测试数据定位到成都导致黄埔区地图偏移
      // map.panTo(newPoint);

      // 更新标记位置
      if (marker) {
        marker.setLngLat(newPoint);
      } else {
        var icon = new window.T.Icon({
          iconUrl: "./marker.png",
          iconSize: new window.T.Point(48, 48),
          iconAnchor: new window.T.Point(24, 48)
        });
        marker = new window.T.Marker(newPoint, {
          icon: icon
        });
        map.addOverLay(marker);
      }

      // ========== 新增轨迹绘制逻辑 ==========
      // 1. 将新点添加到轨迹数组
      trackPoints.push(newPoint);

      // 2. 如果折线不存在则创建
      if (!trackPolyline) {
        trackPolyline = new window.T.Polyline(trackPoints, {
          color: "#FF3300",
          weight: 4,
          opacity: 0.7
        });
        map.addOverLay(trackPolyline);
      }
      // 3. 如果折线已存在则更新路径
      else {
        trackPolyline.setLngLats(trackPoints);
      }
      // ========== 轨迹绘制结束 ==========

    }
  })
}
// 获取数据（真实API调用）
const fetchData = async () => {
  try {
    loading.value = true
    //获取路网列表
    get_camera_list({}).then(res => {
      tableData.value = res.result.data
      for (let i = 0; i < res.result.data.length; i++) {
        let status = res.result.data[i].status == '1' ? '(在线)' : '(离线)'
        options.push({ id: res.result.data[i].deviceSerial, label: '设备' + res.result.data[i].deviceSerial + status })
      }
      console.log("请求摄像头列表成功", tableData.value);
      initcamera(0, 'camera1', options[0].id);
      initcamera(1, 'camera2', options[1].id);
      initcamera(2, 'camera3', options[2].id);
      initcamera(3, 'camera4', options[3].id);

    }).catch(err => {
      console.error('请求摄像头列表失败1:', err)
    });

  } finally {
    loading.value = false
  }
}


// 初始化加载
onMounted(() => {
  fetchData();
  initMap();
})
</script>