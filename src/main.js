import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// vant导入
import Vant from 'vant'
// vant的样式导入
import 'vant/lib/index.css'
// rem适配基准值 相关依赖包导入
import 'amfe-flexible/index.min.js'

// 导入全局样式控制文件
// 注意：在vant的css样式导入之后设置
import '@/assets/css/global.less'

// vant的注册
// 本质：全局方式注册了n多的组件和全局成员
//       Vue.component(xx,function(){})
//       Vue.component(xx,function(){})
//       Vue.prototype.xxx = yyy
//       ……
Vue.use(Vant)

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
