import axios from 'axios';

export const BASEURL = 'https://www.roadradar.cn/dljcboot/';
// export const BASEURL = 'http://localhost:8080/jeecg-boot/';


// 创建 Axios 实例
const service = axios.create({
  baseURL: BASEURL,  // 从环境变量读取接口地址 ‌:ml-citation{ref="2,7" data="citationList"}https://business-web-api.lcsteelworld.com
  timeout: 15000,                              // 超时时间
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// 请求拦截器（携带 Token）
service.interceptors.request.use(
    config => {
        try {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers = {
                    ...config.headers,
                    'X-Access-Token': token
                };
            }
        } catch (error) {
            console.error('Failed to set auth token:', error);
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器（统一错误处理）
// service.interceptors.response.use(
//   response => {
//     if (response.data?.code !== 200) {
//       return Promise.reject(response.data?.message || '请求异常');
//     }
//     return response.data;  // 仅返回核心数据 ‌:ml-citation{ref="2,7" data="citationList"}
//   },
//   error => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';  // 登录失效跳转 ‌:ml-citation{ref="6" data="citationList"}
//     }
//     return Promise.reject(error);
//   }
// );
service.interceptors.response.use(
  res => res.data,
  error => {
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token');
    //   window.location.href = '/login';  // 登录失效跳转 ‌:ml-citation{ref="6" data="citationList"}
    // }
    return Promise.reject(error);
  }
);

export default service;
