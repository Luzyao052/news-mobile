import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入rem基准值配置
import 'amfe-flexible/index.min.js' // 元素实际大小  =  rem * 基准值
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
