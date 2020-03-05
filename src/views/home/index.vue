<template>
  <div class="container">
    <van-tabs v-model="activeChannelIndex">
      <van-tab title="推荐">
        <com-article></com-article>
      </van-tab>
      <van-tab title="数据库">
        <com-article></com-article>
      </van-tab>
      <van-tab title="后端">
        <com-article></com-article>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import ComArticle from './components/com-article.vue'
export default {
  name: 'home-index',
  components: {
    ComArticle
  },
  data () {
    return {
      activeChannelIndex: 0
    }
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  // 弹性布局    原因是为了让上面的标签栏固定高度，然后下面的内容自适应
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  // 标签页具体内容展示区域
  /deep/ .van-tab__pane {
    height: 100%;
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>
