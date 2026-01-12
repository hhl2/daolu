<template>
    <div style="">
      <div >
        <router-view />
        <!-- 页面内容 -->
        <!-- <button @click="SendMesage" style="z-index: 5;">发送消息</button> -->
      </div>
    </div>

    

</template>
  
  <script>
import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.4';
import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.4';
import {get_camera_accesstoken, get_token} from "@/api/user";

// import { get_disease_ue,get_token  } from '@/api/user'
export default {
    name: 'PlayerView',

data(){
    return{
        s:null,
        // diseaselist: [],  // 存储病害列表数据
    }
},
   async mounted() {
     const tokenres = await get_token();
     localStorage.setItem('auth_token', tokenres.result.token);
     const cameratokenres = await get_camera_accesstoken();
     localStorage.setItem('cameratoken', cameratokenres.result.data.accessToken);


      const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle();
      PixelStreamingApplicationStyles.applyStyleSheet();
  
      // Example of how to set the logger level
      // Logger.SetLoggerVerbosity(10);
  
      // Create a config object
      const config = new Config({ useUrlParams: true });
  
      // Create a Native DOM delegate instance that implements the Delegate interface class
      const stream = new PixelStreaming(config);
      this.s = stream;
      
      const application = new Application({
        stream,
        onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
      });

      
      this.s.addResponseEventListener("handle_responses",this.HandleResponse);
      document.body.appendChild(application.rootElement);

      // 调用封装后的方法
      // await this.loadData()

    },
    methods: {
      // async loadData() {
      //   // 病害列表
      //   await get_token().then(res => {
      //       console.log('token-ue5:', res)
      //       //获取路网列表
      //       get_disease_ue({current:1,pagesize:10,token:res.result.token,searchtext:''}).then(res => {
                
      //           this.diseaselist = res.result.records;

      //           console.log('病害列表-ue5:', JSON.stringify(this.diseaselist))
      //       }).catch(err => {
      //           console.error('病害请求失败1-ue5:', err)
      //       });
            
      //   }).catch(err => {
      //       console.error('获取token失败-ue5:', err)
      //   });
      // },
      // ...
      SendMesage:function(message) {
        console.log(this.s);
        this.s.emitUIInteraction(message);
      },
      HandleResponse:function(res){
        console.log('ue呼叫我的',res);
        var json_res  = JSON.parse(res);
        //打开道路信息
        if(json_res.type=='daolu'){
          console.log('呼叫打开道路信息',JSON.parse(res));
          //这一部分打开路网并传递数据到本地存储
          // 保存到本地存储
          localStorage.setItem('roadinfo', JSON.stringify(json_res.data))
          this.$router.push({
            path: '/road',
            query: json_res.data // ➡️ /inspection?id=123
          })
        }
        //打开可视化病害列表
        // if(json_res.type=='road'){
        //   console.log('呼叫打开可视化病害列表',JSON.parse(res));
        //   //这一部分打开路网并传递数据到本地存储
        //   this.$router.push({
        //     path: '/diseaselist',
        //     // query: { id: '20240509', name: '东大街芷泉段' } // ➡️ /inspection?id=123
        //   })
        // }
        if(json_res.type=='disease'){
          console.log('呼叫预演小窗',JSON.parse(res));
          //打开预演小窗
          localStorage.setItem('yyxc', JSON.stringify(json_res.data))
          this.$router.push({
            path: '/planning',
            // query: { id: '20240509', name: '东大街芷泉段' } // ➡️ /inspection?id=123
          })
        }

        if(json_res.type=='yyroad'){
          console.log('呼叫道路预演小窗',JSON.parse(res));
          //打开预演小窗
          localStorage.setItem('yyroadxc', JSON.stringify(json_res.data))
          this.$router.push({
            path: '/yyinfo',
          })
        }

        //呼叫我打开病害基本信息
        if(json_res.type=='binghai'){
          console.log('呼叫我打开病害基本信息',JSON.parse(res));
          //传递病害编号给我
          localStorage.setItem('diseaseinfo', JSON.stringify(json_res.data))
          this.$router.push({
            path: '/disease',
          })
        }

        // 管道属性
        if(json_res.type=='guandao'){
          console.log('呼叫管道属性小窗',JSON.parse(res));
          //打开预演小窗
          localStorage.setItem('gdsx', JSON.stringify(json_res.data))
          this.$router.push({
            path: '/pipe',
            // query: { id: '20240509', name: '东大街芷泉段' } // ➡️ /inspection?id=123
          })
        }
        
      }
    },
    // 正确提供方法
    provide() {
      return {
        playerMethods: {
          sendMessage: (msg) => this.SendMesage(msg) // 箭头函数绑定
        }
      };
    }
}
</script>
  
<style>
body {
    width: 100vw;
    height: 100vh;
    min-height: -webkit-fill-available;
    font-family: 'Montserrat';
    margin: 0;
}
</style>
