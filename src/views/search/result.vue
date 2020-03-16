<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell
      v-for="item in searchList"
      :key="item.art_id.toString()"
      :title="item.title"
      @click="$router.push('/article/'+item.art_id.toString())"
       />
    </van-list>
  </div>
</template>

<script>
import { apiSearchList } from '@/api/search.js'
export default {
  name: 'search-result',
  data () {
    return {
      // 瀑布流相关成员
      loading: false, // 瀑布动画加载效果标志
      finished: false, // 瀑布停止标志
      searchList: [], // 搜索结果列表
      page: 1, // 第几页
      per_page: 10 // 每页几条
    }
  },
  methods: {
    async onLoad () {
      await this.$sleep(800)
      const obj = {
        page: this.page,
        per_page: this.per_page,
        q: this.$route.params.keyword
      }
      const res = await apiSearchList(obj)
      // console.log(res)
      if (res.results.length > 0) {
        // 有数据
        this.searchList.push(...res.results)
        this.page++
      } else {
        // 没有数据
        this.finished = true
        return false
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
