const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          "primary-color": "#5585F5",
          "warning-color": "#FFC200",
          "success-color": "#58A268",
          "link-color": "#1890ff",
          "error-color": "#DE1919"
        },
        javascriptEnabled: true
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV == "production") {
      const curTime = new Date().toLocaleDateString().replace(/\//g, "");
      config.plugin("compress").use(FileManagerPlugin, [
        {
          onEnd: {
            delete: ["./*.zip"],
            archive: [
              {
                source: "./dist",
                destination: `./PC_temp_${curTime}.zip`
              }
            ]
          }
        }
      ]);
    }
  },
  devServer: {
    host: "localhost",
    port: "8080",
    open: false,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_BASEURL,
        changeOrigin: true
        // ws: true // proxy websockets
      }
    }
  }
};
