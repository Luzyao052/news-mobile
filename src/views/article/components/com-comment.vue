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
            <span
              @click="openReply(item.com_id.toString())"
            >{{item.reply_count}}&nbsp;回复</span>
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
        <van-cell v-for="item in replyList" :key="item.com_id.toString()">
          <!-- 作者头像 -->
          <div slot="icon">
            <img class="avatar" :src="item.aut_photo" alt />
          </div>
          <!-- 作者名称 -->
          <div slot="title">
            <span>{{item.aut_name}}</span>
          </div>
          <!-- 回复内容和时间 -->
          <div slot="label">
            <p>{{item.content}}</p>
            <p>
              <span>{{item.pubdate | formatTime}}</span>
            </p>
          </div>
        </van-cell>
      </van-list>
    </van-popup>
    <!-- 添加评论或回复的小构件 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="contentCorR" placeholder="写评论或回复...">
        <!-- slot="button"命名插槽，表明要给van-field的指定位置填充内容，button是输入框的右侧-->
        <van-button
          size="mini"
          :loading="submitting"
          loading-type="spinner"
          slot="button"
          @click="add"
        >提交</van-button>
      </van-field>
    </div>
  </div>
</template>

<script>
// 添加评论或回复
import { apiAddCorR } from '@/api/reply.js'
// 评论api 回复api
import { apiCommentList, apiReplyList } from '@/api/article.js'
export default {
  data () {
    return {
      // 添加评论或回复成员
      contentCorR: '', // 内容
      submitting: false, // 是否正在提交
      // 回复相关
      commentID: '', // 被单击激活的评论ID
      lastID: null, // 分页标志(null、前一次返回的last_id)
      replyList: [], // 回复列表
      // 回复瀑布相关成员，通过reply成员包围，使得与外部的评论瀑布成员没有冲突
      reply: {
        loading: false, // 瀑布动画
        finished: false // 瀑布停止标志
      },
      showReply: false, // 弹出层
      commentList: [], // 评论列表
      offset: null, // 评论分页标志
      loading: false,
      finished: false
    }
  },
  methods: {
    // 添加评论或回复
    async add () {
      // 空的数据不给与处理
      if (!this.contentCorR) {
        this.$toast.fail('请输入一些内容！')
        return false
      }
      this.submitting = true
      // 判断是回复或评论
      if (this.showReply) {
        // 回复
        const obj = {
          target: this.commentID,
          content: this.contentCorR,
          art_id: this.$route.params.aid
        }
        const res = await apiAddCorR(obj)
        this.replyList.unshift(res.new_obj)
        this.$toast.success('发布成功')
        // 找到目标评论，对reply_count做累加
        // findIndex()遍历数组，根据条件找到某个元素的下标
        const index = this.commentList.findIndex(item => {
          // item:代表每个数组元素
          // 条件是：item.com_id.toString()===this.commentID
          return item.com_id.toString() === this.commentID
        })
        // 通过index找到目标评论，对reply_count做累加
        this.commentList[index].reply_count++
      } else {
        // 评论
        const req = {
          target: this.$route.params.aid,
          content: this.contentCorR,
          art_id: null
        }
        const result = await apiAddCorR(req)
        this.commentList.unshift(result.new_obj)
        this.$toast.success('发布成功')
      }
      // 清除添加的表单域信息
      this.contentCorR = ''
      // 恢复按钮为正常状态
      this.submitting = false
    },
    // 对评论回复的瀑布流
    async onLoadReply () {
      await this.$sleep(800)
      // 获得对评论回复的传擦
      const obj = {
        type: 'c',
        source: this.commentID, // 评论id
        offset: this.lastID,
        limit: 10
      }
      const res = await apiReplyList(obj)
      // console.log(res)
      if (res.results.length) {
        this.replyList.push(...res.results)
        this.lastID = res.last_id // 维护分页偏移量
      } else {
        this.reply.finished = true
      }
      // 瀑布加载动画消失
      this.reply.loading = false
    },
    // 点击评论回复
    openReply (commentID) {
      this.commentID = commentID
      this.showReply = true // 展开弹出层
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
  // 添加评论或回复构件
  .reply-container {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 88px;
    width: 100%;
    background: #f5f5f5;
    z-index: 9999;
  }
}
</style>
