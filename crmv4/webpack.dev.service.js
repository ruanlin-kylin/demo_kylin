var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var webpackConfig = require('./webpack.config.js');
var compiler = webpack(webpackConfig);
// var bird = require('birdv3');
var server = new WebpackDevServer(compiler, {

    watchContentBase: true,

    disableHostCheck: true,
    // 允许绑定本地域名
    allowedHosts: [
        '120.25.59.85:11500'
    ],

    // before: function (app) {
    //     app.use(bird('./birdfileConfig.js'))
    // },

    hot: true,
    open:true,
    contentBase: "./",
    historyApiFallback: true,
    // It suppress error shown in console, so it has to be set to false.
    quiet: false,
    // It suppress everything except error, so it has to be set to false as well
    // to see success build.
    noInfo: false,
    inline: true, //开启页面自动刷新
    lazy: false, //不启动懒加载
    watchOptions: {
        aggregateTimeout: 300
    },
    stats: {
        // Config for minimal console.log mess.
        assets: false,
        colors: true,
        version: false,
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false
    },
    proxy: {
        "/crmweb": {
            target: "120.25.59.85:11500",
            // 因为使用的是https，会有安全校验，所以设置secure为false
            // secure: false,
            open:true,
            // port: 8082,
            // ingorePath 默认即为 false, 注释掉也可以
            // ingorePath: false, 
            // changeOrigin是关键，如果不加这个就无法跳转请求
            changeOrigin: true,
        }
    },
    // contentBase不要直接指向pages，因为会导致css、js支援加载不到
    contentBase: __dirname + '/src/',
}).listen(8082, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }
});

/*作者：会撸码的小马
链接：https://www.jianshu.com/p/b3e0cc3863e6
來源：简书
简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。
*/