/**
 * 开发模式
 */
var webpack = require("webpack");
var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
// var htmlWebpackPlugin = require("html-withimg-loader");
var extractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var utils = require('utils');
// 引入HappyPack插件 
const HappyPack = require('happypack');
var glob = require('glob');  //glob，这个是一个全局的模块，动态配置多页面会用得着
const uglify = require('uglifyjs-webpack-plugin');  
var autoprefixer = require('autoprefixer');//给css自动加浏览器兼容性前缀的插件
// 引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
// 拆分css样式的插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');  //
// 如果预先定义过环境变量，就将其赋值给`ASSET_PATH`变量，否则赋值为根目录
const ASSET_PATH = process.env.ASSET_PATH || '/';

var os = require('os');
var portfinder = require('portfinder');  //这个帮助我们寻找可用的端口，如果默认端口被占用了的话
var fs = require('fs');
var ports = fs.readFileSync('./port.json', 'utf8');
var currentPath = '/';

var CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
var ROOT_PATH = path.join(__dirname, '../'); // 项目根目录
var MODULES_PATH = path.join(ROOT_PATH, './node_modules'); // node包目录
var BUILD_PATH = path.join(ROOT_PATH, './dist'); // 最后输出放置公共资源的目录
const devMode = process.env.NODE_ENV === 'development';
const publicPaths = 'http://192.168.1.164:8085/';
var currentPath = '/';
var ctxPath = currentPath + "8085/src"
var website = {
  publicPath: "http://localhost:8085/"
  //publicPath:"http://192.168.1.103:8888/"
}

ports = JSON.parse(ports);
portfinder.basePort = "8080";   //默认端口8080
portfinder.getPort(function (err, port) {
  ports.data.port = port;
  ports = JSON.stringify(ports, null, 4);
  fs.writeFileSync('./port.json', ports);
});

///////////////////获取本机ip///////////////////////
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

//动态添加入口
function getEntry() {
  var entry = {};
  //读取src目录所有page入口
  // glob.sync('./src/scripts/**/*.js').forEach(function(name){
  glob.sync('./src/scripts/**/*.js').forEach(function (name) {
    var start = name.indexOf('src/') + 4;
    var end = name.length - 3;
    var eArr = [];
    var n = name.slice(start, end);
    n = n.split('/')[1];
    eArr.push(name);
    // eArr.push('babel-polyfill');
    entry[n] = eArr;
  })
  return entry;
}

const config = {
  mode: 'development',//设置为开发模式
  performance:{
    hints:false
  },
  devtool: 'eval-source-map',
  // watch:true,   //监控打包
  // watchOptions:{}  //监控的选项
  // entry: {  //入口打包的文件
  //  path:path.resolve(__dirname,"src/app.js"),
  //  main:path.resolve(__dirname,"src/scripts/main.js"),
  //  common:path.resolve(__dirname,"src/scripts/common.js"),
  // },
  // entry: getEntry(),
  entry:{
    main:'./src/scripts/main.js'
  },
  output: {
    //  publicPath:currentPath,
    // publicPath: website.publicPath,
    publicPath: ASSET_PATH,
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    //  chunkFilename: "[name].chunk.js"
    //filename: 'js/[name].[contenthash].js' ////name对应entry的key值，hash为每次打包的hash，chunkhash为每个chunk自己的hash值，可以理解为每个文件的md5值，保证了每个文件的唯一性
    //publicPath: 'http://cdn.com/'   //上线的绝对路径
  },
  resolve: {  //解析
    // modules:[path.resolve('node_modules')],
    // extensions: ['*', '.js','.css', '.json','.coffee'],
    // mainFields:['style','main'],  //
    alias: {
      // 'src': path.resolve(__dirname, './src'),
      // 'assets': path.resolve(__dirname, './src/assets'),
      // 'components': path.resolve(__dirname, './src/components'),
      // "ctx": path.resolve(__dirname, '../src')
      cssUrl:'../src/css'
    }
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                importLoaders: 1
              }
            },
            'postcss-loader',
            'less-loader'
          ],
          publicPath: '../css'
        }),
        exclude: path.resolve(__dirname, './node_modules')
      },
      {
        test: /\.css$/,
        use: [
          {
            loader:'style-loader',
            options:{
              insertAt:"top"
            }
          },
          // MiniCssExtractPlugin.loader,
          'css-loader'
        ],
        exclude: path.resolve(__dirname, './node_modules')
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=babel'],  // 将对.js文件的处理转交给id为babel的HappyPack的实列
        // loader: 'babel-loader',
        exclude: path.resolve(__dirname, 'node_modules') // 排除文件
      },
      {
        test: /\.scss$/,
        // use: ['style', 'css', 'sass']
        // use:['style-loader','css-loader','sass-loader','postcss-loader']//css不分离写法
        //css分离写法
        use:[MiniCssExtractPlugin.loader,"css-loader",{
            loader: "postcss-loader",
            options: {
                plugins: [
                    autoprefixer({
                        browsers: ['ie >= 8','Firefox >= 20', 'Safari >= 5', 'Android >= 4','Ios >= 6', 'last 4 version']
                    })
                ]
            }
        },"sass-loader"]
      },
      {
        test: /\.jpeg|png|jpg|gif$/,
        use: ['file-loader']
      },
      // {
      //   test:/\.(jpeg|png|jpg|gif)$/,
      //   use:{
      //     loader:'url-loader',
      //     options:{
      //       limit:1,
      //       outputPath:'/images/'
      //     }
      //   }
      // },
      {
        test: /\.(woff2?|woff|svg|eot|ttf|oft)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          // options: {
          //   limit: 500,   //当图片小于这个值他会生成一个图片的url 如果是一个大于的他会生成一个base64的图片在js里展示
          //   outputPath: '/images',  //指定打包后的图片位置
          //   name: '[name].[ext]?[hash]',//name:'[path][name].[ext]
          // }
        }
        ]
      },
      {
        test: require.resolve('jquery'),
        // use:'expose-loader?$',
        use: [{
          loader: 'expose-loader',  //暴露全局的Loader  内联
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      {
          test:/\.html$/,
          use:'html-withimg-loader'
          // include:path.join(__dirname,'./src'),
          // exclude:/node_modules/
      }
      // {
      //     test:/\.(html)$/,
      //     use:{
      //       loader:'html-loader',
      //       options:{
      //         attrs:['img:src'],
      //         publicPath:'./',
      //         minimize:true
      //       }
      //     }
      // }
    ]
  },
  plugins: [
    //new uglify(),    //打包时对js文件进行压缩
    // 该插件帮助我们安心地使用环境变量
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH)
    }),
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      // filename: devMode ? '../dist/css/[name].css' : '../dist/css/[name].[hash].css',
      // chunkFilename: devMode ? '../dist/css/[id].css' : '../dist/css/[id].[hash].css',
      filename:'css/main.css'
    }),
    new TransferWebpackPlugin([//作用相当于copy-webpack-plugin
      {
          from: 'assets',
          to: 'assets'
      }
    ], path.resolve(__dirname,"src")),
    new copyWebpackPlugin([  //拷贝
      {
        from: __dirname + '/src/assets/static',//打包的静态资源目录地址
        to: './static' //打包到dist下面的static
      }
    ]),
    new webpack.BannerPlugin('zhangfeng 2019 03 07'),  //加提示
    /****   使用HappyPack实例化    *****/
    new HappyPack({
      // 用唯一的标识符id来代表当前的HappyPack 处理一类特定的文件
      id: 'babel',
      // 如何处理.js文件，用法和Loader配置是一样的
      loaders: ['babel-loader']
    }),
    // 处理styl文件
    new HappyPack({
      id: 'css-pack',
      loaders: ['css-loader']
    }),
    // new HappyPack({
    //   id: 'images',
    //   loaders: [{
    //     loader: require.resolve('url-loader'),
    //     options: {
    //       limit: 10000,
    //       name: '[name].[ext]'
    //     }
    //   }]
    // }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
    }),

    new webpack.ProvidePlugin({
      common: ['src/scripts/js/common/common.js']
    }),

    new webpack.HashedModuleIdsPlugin(),
    new webpack.HotModuleReplacementPlugin()    //引入热更新插件
  ], //插件集合
  devServer: {
    // contentBase:path.join(__dirname,'dist'), //最好设置成绝对路径
    publicPath: '/',//
    //contentBase: path.resolve(__dirname, 'dist'),//此处的路径必须和输出output文件的路径一致 否则无法自动更新，或者是基于output的相对路径
    compress: true,
    historyApiFallback: true,
    // host:'192.168.1.182',   //
    host: 'localhost',
    port: 8082,  //端口
    open: true,  //自动打开页面
    hot: true,   //开启热更新
    inline: true,
    progress: true,
    proxy: { //代理服务
      '/crmweb/*': {
        // contentBase: path.resolve(__dirname, 'dist'),
        publicPath:'../src',
        // target: 'http://120.25.59.85:11500',  //服务器的ip地址
        target:'http://192.168.1.202:8080',  //朱亚辉的ip地址
        // target:'http://192.168.1.124:11500',    //124环境
        secure: false,
        // host: '192.168.1.124:11500',
        // pathRewrite: { '^/crmweb': '/' },
        cnangeOrigin: true
      }
    }
    //useLocalIp: true
  }
}

module.exports = config;
var chunks_name = [];

function getHtmlConfig(name,chunks_name) {
  return {
    //配置模板的路径
    // template: 'html-withimg-loader!'+path.resolve(__dirname, 'src/page/'+name+'.html'),
    template: "./src/page/" + name + ".html",
    //放置目标文件的位置，这个里面的路径是根据output里的path作为相对的路径
    // filename: "page/" + name + '.html',
    filename: "./page/"+ name + '.html',
    projectPath: "../../src",
    title: "首页",
    inject: 'head',
    multihtmlCache: true,
    hash: true,
    chunks:chunks_name,
    removeStyleLinkTypeAttributes: false,
    minify: {                    //html压缩
      removeComments: true,     //移除注释
      collapseWhitespace: true //移除空格  折叠空白区域 也就是压缩代码
    }
  }
}

function getHtmlConfig2(name) {
  return {
    //配置模板的路径
    //  template:"./src/page/"+name+".html",
    template: "./src/page/cloud/menu/" + name + ".html",
    //  template: 'html-withimg-loader!'+path.resolve(__dirname, "./src/page/cloud/menu/"+name+".html"),
    //放置目标文件的位置，这个里面的路径是根据output里的path作为相对的路径
    filename: "page/cloud/menu/" + name + ".html",
    inject: 'head',
    projectPath: "./src",
    multihtmlCache: true,
    hash: true,
    minify: {                    //html压缩
      removeComments: true,     //移除注释
      collapseWhitespace: true //移除空格
    }
  }
}

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

//配置页面
var entryObj = getEntry();

// var htmlArray = [
//   { "_html": "index", "title": "首页", "chunks": "index" },
//   { "_html": "login", "title": "登录", "chunks": "login" },
//   { "_html": "cloud/menu/calendar", "title": "calendar", "chunks": "calendar" },
//   { "_html": "cloud/menu/setting", "title": "设置", "chunks": "setting" },
//   { "_html": "cloud/menu/pageLayout", "title": "自定义", "chunks": "pageLayout" },
//   { "_html": "cloud/menu/tableList", "title": "列表", "chunks": "tableList" },
//   { "_html": "cloud/menu/tableTeam", "title": "表格组", "chunks": "tableTeam" },
//    { "_html": "cloud/menu/tableTeamDetail", "title": "表格组详情", "chunks": "tableTeamDetail" },
//    { "_html": "cloud/menu/form", "title": "表单", "chunks": "form" },
//   { "_html": "cloud/menu/homePage", "title": "首页", "chunks": "homePage" },
//   { "_html": "cloud/menu/tableTeamTab", "title": "页签", "chunks": "tableTeamTab" },
//   { "_html": "cloud/menu/definedPageEdit", "title": "definedPageEdit", "chunks": "definedPageEdit" },
//   { "_html": "cloud/menu/messageList", "title": "消息列表", "chunks": "messageList" }
// ];

var htmlArray = [
  { "_html": "index", "title": "首页", "chunks": "index" },
  { "_html": "login", "title": "登录", "chunks": "login" },
  { "_html": "cloud/menu/calendar", "title": "calendar", "chunks": "calendar" },
  { "_html": "cloud/menu/setting", "title": "设置", "chunks": "setting" },
  { "_html": "cloud/menu/viewSetting", "title": "视图显示设置", "chunks": "viewSetting" },
  { "_html": "cloud/menu/pageLayout", "title": "自定义", "chunks": "pageLayout" },
  { "_html": "cloud/menu/tableList", "title": "列表", "chunks": "tableList" },
  { "_html": "cloud/menu/tableListAboutItem", "title": "列表2", "chunks": "tableListAboutItem" },
  { "_html": "cloud/menu/tableTeam", "title": "表格组", "chunks": "tableTeam" },
   { "_html": "cloud/menu/tableTeamDetail", "title": "表格组详情", "chunks": "tableTeamDetail" },
   { "_html": "cloud/menu/form", "title": "表单", "chunks": "form" },
   { "_html": "cloud/menu/formSetting", "title": "表单设置", "chunks": "formSetting" },
  { "_html": "cloud/menu/homePage", "title": "首页", "chunks": "homePage" },
  { "_html": "cloud/menu/tableTeamTab", "title": "页签", "chunks": "tableTeamTab" },
  { "_html": "cloud/menu/definedPageEdit", "title": "definedPageEdit", "chunks": "definedPageEdit" },
  { "_html": "cloud/menu/messageList", "title": "消息列表", "chunks": "messageList" }
];
// //自动生成html模板
htmlArray.forEach(function (element) {
  console.log("模板：" + JSON.stringify(element));
  chunks_name.push(element.chunks);
  // module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
  module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
})