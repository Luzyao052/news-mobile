import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// localStorage 存储用户信息的key名称，统一设置，方便后续使用
const USER_KEY = 'news-mobile'

export default new Vuex.Store({
  state: {
    // 通过 || 设定，如果localStorage没有数据，就返回{}空对象
    user: JSON.parse(localStorage.getItem(USER_KEY) || '{}'),
    cachePage: ['layOut']
  },
  mutations: {
    // 修改/更新用户信息
    // data:{token:xx,refresh_token:xx}
    updateUser (state, data) {
      // 1. vuex做更新，使得有响应式
      state.user = data
      // 2. localStorage做持久更新
      localStorage.setItem(USER_KEY, JSON.stringify(data))
    },
    // 清除用户信息
    clearUser (state) {
      // 1. vuex做清除，使得有响应式
      state.user = {}
      // 2. localStorage做持久清除
      localStorage.removeItem(USER_KEY)
    },
    // 模拟删除token数据，
    clearToken (state) {
      delete state.user.token
    },

    // 添加缓存页面
    addCachePage (state, name) {
      if (!state.cachePage.includes(name)) {
        state.cachePage.push(name)
      }
    },

    // 移除缓存页面
    removeCachePage (state, name) {
      const index = state.cachePage.indexOf(name)
      if (index !== -1) {
        state.cachePage.splice(index)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})
