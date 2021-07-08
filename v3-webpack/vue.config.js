module.exports = {
  publicPath: './',
  productionSourceMap: false,
  runtimeCompiler: true,
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    port: '8080',
    open: false,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: process.env.VUE_APP_BASEURL,
        changeOrigin: true,
        // ws: true // proxy websockets
      },
    },
  },
};
