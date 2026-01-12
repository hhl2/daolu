const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //publicPath: process.env.VUE_APP_BASE_URL || '/',
  devServer: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'https://business-web-api.lcsteelworld.com',  // 目标接口地址‌:ml-citation{ref="6,7" data="citationList"}
        changeOrigin: true,  // 启用跨域支持‌:ml-citation{ref="2,6" data="citationList"}
        rewrite: path => path.replace(/^\/api/, '')  // 路径重写规则‌:ml-citation{ref="6" data="citationList"}
      },
    },
  },
  // 打包配置
  outputDir: 'dist', // 打包输出目录
  assetsDir: 'assets', // 静态资源目录（相对于outputDir）
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/', // 公共路径，用于指定打包后应用的基本URL

  // 是否为生产环境构建生成source map
  productionSourceMap: false,
  css: {
    extract: true, // 确保CSS提取
  },
})
