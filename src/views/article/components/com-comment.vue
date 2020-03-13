<template>
  <div class="comment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in commentList" :key="item.com_id.toString()">
        <!-- 作者头像 slot="icon" 是cell单元格命名插槽，自定义左侧图标-->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 作者名称 slot="title" 是cell单元格命名插槽，左侧标题内容-->
        <div slot="title">
          <span>{{item.aut_name}}</span>
        </div>
        <!-- 点赞 slot="default" 是cell单元格命名插槽，右侧内容-->
        <div slot="default">
          <van-button
            icon="like-o"
            size="mini"
            plain
            :type="item.is_liking?'danger':'default'"
          >&nbsp;{{item.like_count}}</van-button>
        </div>
        <!-- 评论内容和时间 slot="label" 是cell单元格命名插槽，下方描述信息-->
        <div slot="label">
          <p>{{item.content}}</p>
          <p>
            <span>{{item.pubdate | formatTime}}</span>
            ·
            <span @click="showReply=true">{{item.reply_count}}&nbsp;回复</span>
          </p>
        </div>
      </van-cell>
    </van-list>
    <!-- 回复列表展示-弹出层/瀑布 -->
    <van-popup v-model="showReply" position="bottom" :style="{ height: '80%' }">
      <!-- 瀑布加载效果 -->
      <van-list
        v-model="reply.loading"
        :finished="reply.finished"
        finished-text="没有更多了"
        @load="onLoadReply"
      >
        <van-cell v-for="item in reply.list" :key="item" :title="item" />
      </van-list>
    </van-popup>
  </div>
</template>

<script>
// 评论api
import { apiCommentList } from '@/api/article.js'
export default {
  data () {
    return {
      // 回复瀑布相关成员，通过reply成员包围，使得与外部的评论瀑布成员没有冲突
      reply: {
        list: [],
        loading: false, // 瀑布动画
        finished: false // 瀑布停止标志
      },
      showReply: false,
      commentList: [], // 评论列表
      offset: null, // 评论分页标志
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    // 对评论回复的瀑布流
    onLoadReply () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.reply.list.push(this.reply.list.length + 1)
        }

        // 加载状态结束
        this.reply.loading = false

        // 数据全部加载完成
        if (this.reply.list.length >= 40) {
          this.reply.finished = true
        }
      }, 1000)
    },
    // 评论瀑布流
    async onLoad () {
      await this.$sleep(800)
      // 获取评论的传参
      const obj = {
        type: 'a',
        source: this.$route.params.aid, // 文章的id
        offset: this.offset,
        limit: 10
      }
      const res = await apiCommentList(obj)
      // console.log(res)
      if (res.results.length) {
        this.commentList.push(...res.results)
        // 对分页标志offset进行赋值
        this.offset = res.last_id
      } else {
        this.finished = true
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang='less'>
.comment {
  margin-top: 15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    margin-right: 10px;
  }
  /deep/ .van-cell__title {
    .van-cell__label {
      width: 400px;
    }
  }
}
</style>
