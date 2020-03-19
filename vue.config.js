module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    port: '12233'
  },
  // 配置dist/index.html文件引用静态文件的根地址信息为当前目录
  publicPath: './'
}
