const {
  sep
} = require('path')

module.exports = ({
  file
}) => {
  const rootValue = file.dirname.indexOf(`node_modules${sep}vant`) !== -1
    ? 37.5
    : 75

  return {
    plugins: {
      autoprefixer: {},
      'postcss-pxtorem': {
        rootValue,
        propList: ['*']
      }
    }
  }
}
// 根值：rootValue   默认是37.5，来自于设计稿大小的10分之一
// rem单位值 = px像素值  /  rootValue(根植，是px向rem转换的砝码)
// lib-flexible 用于设置 rem 基准值 也就是设置font-size
// 此时，审查元素会看到切换不同设备时,html的font-size会随着页面大小改变而变化，大小是页面实际宽度的1/10
// 元素实际大小  =  rem * 基准值
