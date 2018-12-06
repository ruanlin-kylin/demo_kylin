'use strict'

const glob = require('glob')
const titles = require('./title.js')
const pages = {}

glob.sync('./src/pages/**/main.js').forEach(path=>{
  console.log(path)
  const chunk = path.split('./src/pages/')[1].split('/main.js')[0]
  console.log(chunk)
  pages[chunk] = {
    entry: path,
    template: 'public/index.html',
    title: titles[chunk],
    //chunks 选项的作用主要是针对多入口(entry)文件。当你有多个入口文件的时候，对应就会生成多个编译后的 js 文件。
    //那么 chunks 选项就可以决定是否都使用这些生成的 js 文件。
    //chunks 默认会在生成的 html 文件中引用所有的 js 文件，当然你也可以指定引入哪些特定的文件。
    chunks: ['chunk-vendors', 'chunk-common', chunk]
  }
})

module.exports = {
  pages,
  // 删除named-chunks插件，为了解决pages多页配置超过5个不能编译的问题
  chainWebpack: config => config.plugins.delete('named-chunks'),
  //默认情况下babel-loader忽略其中的所有文件node_modules。如果要使用Babel显式转换依赖关系，可以在此选项中列出它
  transpileDependencies: [/\bvue-awesome\b/],
  // 不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建,map就是为了方便打印错误位置。
  productionSourceMap: false,
  // 它支持webPack-dev-server的所有选项
  devServer: {
    host: "localhost",
    port: 8080, // 端口号
    open: true, //配置自动启动浏览器
    // proxy: 'http://localhost:9000' // 配置跨域处理,只有一个代理

    // 配置多个代理
    proxy: {
      "/merchant": {
        target: "http://merchant.dev.chinaoilpay.com",
        ws: false,
        changeOrigin: true
      },
      "/combine": {
        target: "http://merchant.dev.chinaoilpay.com",
        changeOrigin: true
      },
      "/order": {
        target: "http://merchant.dev.chinaoilpay.com",
        changeOrigin: true
      }
    }
  }
};
