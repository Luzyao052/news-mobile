<template>
  <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
  <div class="scroll-wrapper">
    <!-- 下拉包围上拉 -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="successText"
      animation-duration="1500"
    >
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- van-cell单元格组件
        特点：独占一行
        用法非常灵活、复杂
        title：单元格标题内容
        -->
        <van-cell
          v-for="item in articleList"
          :key="item.art_id.toString()"
          :title="item.title"
          @click="$router.push('/article/'+item.art_id.toString())"
        >
          <template slot="label">
            <van-grid :border="false" :column-num="item.cover.type" v-if="item.cover.type>0">
              <van-grid-item v-for="(val,index) in item.cover.images" :key="index">
                <!-- lazy-load设置图片懒加载，是一个自定义指令 -->
                <van-image width="85" height="85" :src="val" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <!-- 右侧叉号 -->
              <van-icon
                name="close"
                style="float:right;"
                @click="displayDialog(item.art_id.toString())"
              />
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate | formatTime}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!-- 弹出框 -->
    <my-dislog v-model="showDialog" :articlID="nowArticleID" @dislikeSuccess="handleDislikeSuccess"></my-dislog>
  </div>
</template>

<script>
// 导入弹出框
import MyDislog from './com-moreaction.vue'
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
  components: {
    MyDislog
  },
  data () {
    return {
      successText: '', // 下拉动作完成后的动画提示内容
      nowArticleID: '', // 1. 不感兴趣文章id
      showDialog: false, // 控制子组件弹出框是否显示
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
    // 处理不喜欢的文章
    handleDislikeSuccess () {
      // 让 nowArticleID 文章在列表中消失
      // 1. 获得目标文章id在文章列表中的下标序号
      //    findIndex()是数组的一个方法，可以通过条件获得指定目标在数组列表中的"下标序号"，有遍历机制
      // 各种底层方法api：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide
      const index = this.articleList.findIndex(item => {
        // 满足条件就return为true信息出来，那么当前项目的下标序号就获得的到了
        return item.art_id.toString() === this.nowArticleID
      })
      // 2. 通过下标序号从列表中删除指定的文章
      // 数组.splice(下标, 长度)
      this.articleList.splice(index, 1)
    },
    // 弹出框
    displayDialog (artId) {
      this.showDialog = true
      this.nowArticleID = artId
    },
    // 获取文章
    async getArticleList () {
      const res = await apiArticleList(this.reqArticles)
      return res
      // this.articleList = res.results
      // console.log(res)
    },
    // 下拉执行的动作
    async onRefresh () {
      await this.$sleep(800)
      const articles = await this.getArticleList()
      if (articles.results.length > 0) {
        this.articleList.unshift(...articles.results)
        this.reqArticles.timestamp = articles.pre_timestamp
        this.successText = '文章更新成功'
      } else {
        this.successText = '已经是最新的文章'
      }
      this.isLoading = false
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
