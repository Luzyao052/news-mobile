<template>
  <van-cell class="container">
    <!-- 自己的导航栏
    left-arrow：左侧有箭头
    @click-left：单击左侧箭头的事件处理
    -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search
      v-model.trim="searchText"
      placeholder="请输入搜索关键词"
      @input="serachChange"
      @search="onSearch(searchText)"
    />
    <van-cell-group v-if="suggestionList.length">
      <!-- 联想关键字列表 -->
      <van-cell icon="search" v-for="(item,i) in suggestionList" :key="i" @click="onSearch(item)">
        <!-- 因为要应用methods方法，并且该方法返回的信息里边有 html标签+css样式
        所以不要直接使用title属性，相反要应用命名插槽，内部结合v-html应用-->
        <div slot="title" v-html="highLightCell(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <!-- 历史记录 -->
      <van-cell title="历史记录">
        <!-- slot="right-icon" 命名插槽 给 cell单元格的右边显示内容(垃圾桶图标) -->
        <van-icon
          name="delete"
          slot="right-icon"
          v-show="!isDeleteData"
          @click="isDeleteData=!isDeleteData"
          style="line-height:inherit"
        ></van-icon>
        <div slot="default" v-show="isDeleteData">
          <span style="margin-right:10px" @click="suggestDelAll()">全部删除</span>
          <span @click="isDeleteData=!isDeleteData">完成</span>
        </div>
      </van-cell>
      <!-- 历史联想项目数据展示
      v-for="(item,index) in $store.state.user.token?historyList:suggestHistories"-->
      <van-cell :title="item" v-for="(item,index) in historyList" :key="index">
        <van-icon
          v-show="isDeleteData"
          slot="right-icon"
          name="close"
          style="line-height:inherit"
          @click="suggestDel(index)"
        ></van-icon>
      </van-cell>
    </van-cell-group>
  </van-cell>
</template>

<script>
import { apiSearchSuggestion, apiSearchHistory, apiSearchHistoryDel } from '@/api/search.js'
// 设置关键字历史记录的localStorage的key的名称，方便后续使用
const key = 'suggest-histories'
export default {
  name: 'search-index',
  data () {
    return {
      // 联想历史记录
      // suggestHistories: JSON.parse(localStorage.getItem(SH) || '[]'),
      historyList: [],
      isDeleteData: false, // 联想历史记录是否进入删除状态
      searchText: '',
      suggestionList: [] // 联想建议数据
    }
  },
  created () {
    this.getHistory()
  },
  methods: {
    // 删除全部的历史记录
    async suggestDelAll () {
      // 1. 页面级，响应式效果
      this.historyList = []
      // 2. 持久级
      await apiSearchHistoryDel()
    },
    // 删除单独的历史记录
    suggestDel (index) {
      // 因为没有单独删的接口 只能判断是否本地进行删除
      if (this.$store.state.user.token) {
        // 页面级，假删除
        this.historyList.splice(index, 1)
      } else {
        // 1. 页面级，响应式效果
        this.historyList.splice(index, 1)
        // 2. 持久级localStorage
        localStorage.setItem(key, JSON.stringify(this.historyList))
      }
    },
    // 获取历史记录
    async getHistory () {
      const res = await apiSearchHistory()
      // console.log(res)
      this.historyList = res
    },
    // 点击搜索
    async onSearch (kw) {
      if (!kw) {
        return false
      }
      // 避免的是登录账号添加搜索的历史纪录时，也会存储到本地
      if (!this.$store.state.user.token) {
        const sh = new Set(this.historyList)
        sh.add(kw)
        const searchHistoryList = Array.from(sh)
        localStorage.setItem(key, JSON.stringify(searchHistoryList))
      }
      // 跳转
      this.$router.push('/search/result/' + kw)
    },
    // 高亮显示
    highLightCell (content, keywords) {
      const reg = new RegExp(keywords, 'i') // 正则
      const ret = content.match(reg) // 匹配内容 （对象、null）
      // console.log(rst) // ["vue", index: 0, input: "vue本地项目获s", groups: undefined]
      // 结论：
      // rst[0]： 就是从目标内容中匹配到关键字信息【重点】
      // rst['index']：关键字出现的下标位置
      // rst['input']：代表完整的目标内容
      // 如果没有高亮，返回原内容
      if (ret === null) {
        return content
      }
      // 对目标内容的关键字做替换
      return content.replace(reg, `<span style="color:red">${ret[0]}</span>`)
    },
    serachChange (val) {
      // 这个默认参数是vant 事件自带的
      // 该监听器每次进来的时候，首先清除 this.timer（就是setTimeout停止）定时器
      clearTimeout(this.timer)
      if (!val) {
        this.suggestionList = []
        return false
      }
      // 防抖
      this.timer = setTimeout(async () => {
        // 直接用this.timer而不在data中声明是为了声明临时成员
        // 给当前组件临时声明一个timer的临时成员，这个成员不用事先通过data声明
        // 组件运行期间都生效，使得就是唯一的timer被使用(即使事件被多次调用)
        const obj = { q: val }
        const res = await apiSearchSuggestion(obj)
        // console.log(res)
        this.suggestionList = res.options
      }, 800)
    }
  }
}
</script>

<style scoped lang='less'></style>
