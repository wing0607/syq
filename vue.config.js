const path = require('path')
module.exports = {
  publicPath: './',
  indexPath: 'index.html',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://rainwater.app.19930322.com:9000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',//重写,
        }
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '加载中...'
        return args
      })
  }




}