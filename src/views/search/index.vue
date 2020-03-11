<template>
  <div class="container">
    <!-- 自己的导航栏
    left-arrow：左侧有箭头
    @click-left：单击左侧箭头的事件处理
    -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" @input="serachChange" />
    <van-cell-group>
      <van-cell :title="item" icon="search" v-for="(item,i) in suggestionList" :key="i"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { apiSearchSuggestion } from '@/api/search.js'
export default {
  name: 'search-index',
  data () {
    return {
      searchText: '',
      suggestionList: [] // 联想建议数据
    }
  },
  methods: {
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
