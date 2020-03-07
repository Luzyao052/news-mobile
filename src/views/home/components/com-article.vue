<template>
  <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
  <div class="scroll-wrapper">
    <!-- 下拉包围上拉 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell单元格组件
        特点：独占一行
        用法非常灵活、复杂
        title：单元格标题内容
        -->
        <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title">
          <template slot="label">
            <van-grid :border="false" :column-num="item.cover.type" v-if="item.cover.type>0">
              <van-grid-item v-for="(val,index) in item.cover.images" :key="index">
                <van-image width="85" height="85" :src="val" />
              </van-grid-item>
            </van-grid>
            <p>
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入文章api函数
import { apiArticleList } from '@/api/article.js'
export default {
  name: 'com-article',
  // props: ['channelID'],
  props: {
    channelID: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      articleList: [], // 文章列表
      // 请求文章对象
      reqArticles: {
        channel_id: this.channelID, // 父组件传来的频道ID
        timestamp: Date.now(), // 时间戳参数，用于分页获取文章信息
        with_top: 1
      },
      // 下拉成员
      isLoading: false, // 是否处于加载状态
      // 上拉相关成员
      list: [], // 数据源
      loading: false, // 瀑布流是否加载处于动画效果
      finished: false // 瀑布流是否停止
    }
  },
  created () {
    this.getArticleList() // 文章
  },
  methods: {
    // 获取文章
    async getArticleList () {
      const res = await apiArticleList(this.reqArticles)
      return res
      // this.articleList = res.results
      // console.log(res)
    },
    // 下拉执行的动作
    onRefresh () {
      setTimeout(() => {
        this.onLoad() // 调用上拉获得数据
        this.isLoading = false // 下拉加载完成/结束加载动画
        this.$toast.success('刷新成功') // 成功提示
      }, 1000)
    },
    // 瀑布流上拉执行的动作
    async onLoad () {
      await this.$sleep(800)
      // 瀑布 与 真实文章 结合
      // 1. 获得真实文章数据
      const articles = await this.getArticleList()
      // articles:{results:文章列表，pre_timestamp:分页时间戳}
      // console.log(articles)
      // 2. 对数据做处理
      if (articles.results.length > 0) {
        // 有获得数据
        // data接收数据，要设置"追加"，不要直接赋值
        // 直接赋值会使得瀑布的数据区域填充不满，会造成瀑布不断加载效果
        // this.articleList = articles.results
        // articles.results:[{id,title,xx},{id,title,xx},{id,title,}……]
        this.articleList.push(...articles.results)
        // ... 展开运算符，是要把[]数组标志给去除，使得内部各个小元素暴露出来，进而被push追加使用
        // this.articleList.push({id,title,xx},{id,title,xx},{id,title,}……)
        // 更新时间戳，方便获取"下一页"数据
        this.reqArticles.timestamp = articles.pre_timestamp
      } else {
        // 没有获得到数据，要停止瀑布流
        this.finished = true
      }
      // 3. 停止瀑布加载动画
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.scroll-wrapper {
  height: 100%;
  // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
  // 是瀑布实现的关键要素
  overflow-y: auto;
}
</style>
