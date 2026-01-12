import request from '@/utils/request';


export const get_camera_accesstoken = (data) =>{
  return request({
    url: '3d/camera/getToken',
    method: 'get',
    data
  })
}
export const get_camera_list = (data) =>{
  return request({
    url: '3d/camera/getDeviceList?accessToken='+localStorage.getItem('cameratoken'),
    method: 'get',
    data
  })
}


//获取token
export const get_token = (data)=>{
  return request({
    url: 'sys/getToken?username=cdu&password=cd-201818',
    method: 'get',
    data
  }).catch((error) => {
    console.error('获取token失败:', error); // 打印错误信息到控制台
    throw error; // 抛出错误以便上层调用者处理
  });
}

//道路列表 路网
export const get_work = (data)=>{
  if (typeof data.riskLevel !== 'undefined' && data.riskLevel !== null) {
    // 对象存在且不为null
    
  }else{
    data.riskLevel  = ''
  }
  console.log('道路列表给UE','/dljcboot/3d/sysAreaRoad/list?_t=1745313157&xzq=510100&roadName=*'+data.searchtext+'*&column=createTime&order=desc&field=id,,,projectId_dictText,taskId_dictText,xzq_dictText,surveyRoadMile,finishMile,surveyDate,surveyLineNum,surveyMile,finishSurveyMile,action&pageNo='+data.current+'&pageSize='+data.pagesize);
  // console.log('/dljcboot/3d/sysAreaRoad/list?_t=1745313157&xzq=510100&roadName=*'+data.searchtext+'*&column=createTime&order=desc&field=id,,,projectId_dictText,taskId_dictText,xzq_dictText,surveyRoadMile,finishMile,surveyDate,surveyLineNum,surveyMile,finishSurveyMile,action&pageNo='+data.current+'&pageSize='+data.pagesize+');
  return request({
    url: '3d/sysAreaRoad/list?xzq=510100&roadName='+data.searchtext+'&riskLevel='+data.riskLevel+'&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}

//道路详情
// export const get_sysroad_info = (data) => {
//     console.log('查询道路信息', '/baseInfo/sysAreaRoad/queryById?id='+data.id );
//     return request({
//         url: '/baseInfo/sysAreaRoad/queryById?id='+data.id ,
//         method: 'get',
//         data
//     })
// }

//成因统计
export const get_cause = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countBy?countType=reason&xzq=510100&years=&province=510000&city=510100&area=',
    method: 'get',
    data
  })
}

//病害趋势
export const get_trends = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countByYearsBhtattr?xzq=510100&years=&province=510000&city=510100&area=',
    method: 'get',
    data
  })
}


//塌陷列表
export const get_collpse = (data)=>{
  console.log('get_tx_list',data.searchtext);
  if (typeof data.roadName !== 'undefined' && data.roadName !== null) {
    // 对象存在且不为null
    
  }else{
    data.roadName  = ''
  }  
  return request({
    url: 'collapse/dljcCollapse/list?xzq=510100&roadName='+data.roadName+'&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}

//病害列表
export const get_disease = (data)=>{
  console.log('get_disease',data.searchtext);
  if (typeof data.roadname !== 'undefined' && data.roadname !== null) {
    // 对象存在且不为null
    
  }else{
    data.roadname  = ''
  }

  if (typeof data.searchtext !== 'undefined' && data.searchtext !== null) {
    // 对象存在且不为null
  }else{
    data.searchtext  = ''
  }

  if (typeof data.xzq !== 'undefined' && data.xzq !== null) {
    // 区域
  }else{
    //默认成都
    data.xzq  = '510100'

  }
  if (typeof data.riskLevel !== 'undefined' && data.riskLevel !== null) {
    // 对象存在且不为null
  }else{
    data.riskLevel  = ''
  }
  if (typeof data.status !== 'undefined' && data.status !== null) {
    // 对象存在且不为null
  }else{
    data.status  = ''
  }
  //这样增加没有增加条件的不会出错
  if (typeof data.years !== 'undefined' && data.years !== null) {
    // 对象存在且不为null
  }else{
    data.years  = ''
  }
  if (typeof data.disasterType !== 'undefined' && data.disasterType !== null) {
    // 对象存在且不为null
  }else{
    data.disasterType  = ''
  }

  if (typeof data.bhtAttrs !== 'undefined' && data.bhtAttrs !== null) {
    // 对象存在且不为null
  }else{
    data.bhtAttrs  = ''
  }
  
  

  // console.log(data.current);
   console.log('病害列表给UE','https://www.roadradar.cn/dljcboot/disasters/dljcDisastersArchives/listsub?_t=1746771981&hisCode='+data.searchtext+'&xzq=510100&column=createTime&order=desc&field=id,,,projectId_dictText,taskId_dictText,xzq_dictText,surveyRoadMile,finishMile,surveyDate,surveyLineNum,surveyMile,finishSurveyMile,action&&pageNo='+data.current+'&pageSize='+data.pagesize);
  return request({
    // url: '/dljcboot/disasters/dljcDisastersArchives/list?_t=1745313157&xzq=510100&roadName=*'+data.searchtext+'*&column=createTime&order=desc&field=id,,,projectId_dictText,taskId_dictText,xzq_dictText,surveyRoadMile,finishMile,surveyDate,surveyLineNum,surveyMile,finishSurveyMile,action&pageNo='+data.current+'&pageSize='+data.pagesize+,
    url: 'disasters/dljcDisastersArchives/list?bhtAttrs='+data.bhtAttrs+'&years='+data.years+'&disasterCode='+data.searchtext+'&xzq='+data.xzq+'&roadName='+data.roadName+'&riskLevel='+data.riskLevel+'&disasterType='+data.disasterType+'&status='+data.status+'&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}

//病害复测列表（根据档案号）
export const get_disease_repeat = (data)=>{
  // console.log(data.current);
  return request({
    url: 'disasters/dljcDisastersArchives/listsub?disasterCode='+data.hiscode+'&xzq=510100&column=reportDate&order=asc',
    method: 'get',
    data
  })
}

//病害类型及数量
export const get_disease_type = (data)=>{
  // console.log(data.current);
  if(!data){
    data = {}
  }
  if( !data.projectId){
    data.projectId='';
  }
  return request({
    url: '3d/disastersCount/countBy?countType=bhtAttr&xzq=510100&projectId='+data.projectId,
    method: 'get',
    data
  })
}

//病害风险等级
export const get_disease_level = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countBy?countType=riskLevelAttr&xzq=510100&roadName=',
    method: 'get',
    data
  })
}

//全市道路排名
export const get_road_rank = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countBy?countType=road&xzq=510100&years=',
    method: 'get',
    data
  })
}

//行政区排名
export const get_road_state = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countBy?countType=area&xzq=510100',
    method: 'get',
    data
  })
}

//治理情况
export const get_disease_fixed = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/disastersCount/countBy?countType=status&xzq=510100',
    method: 'get',
    data
  })
}

//每公里车道病害数量趋势图(个/km)
export const get_road_kilometer = (data)=>{
  // console.log(data.current);
  return request({
    url: '3d/projectCount/countBy?queryYearFrom=2020%2C2021%2C2022%2C2023%2C2024&countType=chedaomilebhtByYears&xzq=510100',
    method: 'get',
    data
  })
}

//道路风险预警
export const get_road_yj = (data)=>{
  // console.log(data.current);
  return request({
    // url: '/dljcboot/riskforcast/dljcRoadRiskTaskSet/listQuery?_t=1746684853&xzq=510100&roadName=*'+data.searchtext+'*&column=createTime&order=desc&field=id,,,xzq_dictText,riskLevel_dictText,riskNum,lastCompDay,action&pageNo='+data.current+'&pageSize='+data.pagesize,
    url: '3d/riskforcastCount/listQuery?xzq=510100&roadName='+data.searchtext+'&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}

//道路检测情况列表
export const get_road_jcqk = (data)=>{
  console.log("get_road_jcqk",data);
  return request({
    url: 'project/dljcSurveyRoad/list?xzq=510100&roadName='+data.roadName+'&column=updateTime&order=asc&pageNo='+data.current+'&pageSize='+data.pageSize,
    method: 'get',
    data
  })
}


//病害列表给UE
export const get_disease_ue = (data)=>{
  console.log('病害列表给UE','/dljcboot/disasters/dljcDisastersArchives/listsub?_t=1746771981&disasterCode='+data.searchtext+'&xzq=510100&column=createTime&order=desc&field=id,,,projectId_dictText,taskId_dictText,xzq_dictText,surveyRoadMile,finishMile,surveyDate,surveyLineNum,surveyMile,finishSurveyMile,action&&pageNo='+data.current+'&pageSize='+data.pagesize );
  return request({
    url: 'disasters/dljcDisastersArchives/listsub?disasterCode='+data.searchtext+'&xzq=510100&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}

//风险曲线接口
export const get_risk = (data)=>{
  console.log('风险曲线接口',data.searchtext);
  return request({
    url: '3d/sysAreaRoad/countBy?countType=riskLine&roadName='+data.searchtext+'&xzq=510100',
    method: 'get',
    data
  })
}

//检测、处置、巡检 的病害相关信息
export const get_lc = (data)=>{
  console.log('查询 检测、处置、巡检 的病害相关信息',data);
  if(!data.searchtext) {
    data.searchtext = '';
  }
  if(!data.projectId){
    data.projectId = '';
  }

  return request({
    url: '3d/disastersCount/bhjclccount?projectId='+data.projectId+'&roadName='+data.searchtext+'&xzq=510100',
    method: 'get',
    data
  })
}

//检测的项目相关信息
export const get_jc = (data)=>{
  console.log('检测相关信息',data.searchtext);
  return request({
    url: 'project/dljcProject/countProjectByRoad?xzq=510100&roadName='+data.searchtext+'&column=createTime&order=desc',
    method: 'get',
    data
  })
}


//检测的项目相关信息
export const get_xiangmu = (data)=>{
  if(!data.projectId){
    data.projectId=''
  }
   return request({
    url: 'project/dljcProject/list?xzq=510100&column=updateTime&order=desc',
    method: 'get',
    data
  })
}
/**
 * 项目相关的检测道路
 * @param data
 * @returns {*}
 */
export const get_xiangmu_daolu = (data)=>{
  return request({
    url: 'project/dljcSurveyRoad/list?projectId='+data.projectId+'&xzq=510100&column=updateTime&order=desc&pageNo='+data.current+'&pageSize='+data.pagesize,
    method: 'get',
    data
  })
}


export const get_car_position = (data)=>{
  return request({
    url: 'carcheck/syncCarLocation',
    method: 'get',
    data
  })
}