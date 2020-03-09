<template>
  <div class="container">
    <van-tabs v-model="activeChannelIndex">
      <div slot="nav-right" class="threeLine">
        <van-icon name="wap-nav" @click="showPopup=true" />
      </div>
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
    <!-- 弹出层 -->
    <com-channel
      v-model="showPopup"
      :channelList="channelList"
      :activeChannelIndex="activeChannelIndex"
    ></com-channel>
  </div>
</template>

<script>
// 对com-channel.vue 做导入、注册、使用
import ComChannel from './components/com-channel.vue'
// 导入频道api
import { apiUserChannel } from '@/api/channel.js'
// 对com-article.vue 做导入、注册、使用
import ComArticle from './components/com-article.vue'
export default {
  name: 'home-index',
  components: {
    ComArticle,
    ComChannel
  },
  data () {
    return {
      showPopup: false, // 控制子组件弹出层是否显示
      activeChannelIndex: 0, // 激活频道下标标志
      channelList: [] // 用户频道列表
    }
  },
  created () {
    this.getChannelList() // 频道
  },
  methods: {
    // 获取频道
    async getChannelList () {
      const res = await apiUserChannel()
      this.channelList = res.channels
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

/deep/ .van-tabs__wrap {
  width: 90%;
}
.threeLine {
  position: fixed;
  right: 10px;
  font-size: 40px;
  background-color: white;
  line-height: 88px;
  height: 88px;
  width: 90px;
  text-align: center;
}
</style>
