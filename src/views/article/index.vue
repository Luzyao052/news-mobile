<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <van-button
          :loading="followLoading"
          round
          size="small"
          @click="followMe()"
          type="info"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <!--  -->
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          class="active"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button round size="small" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 评论区 -->
      <com-comment></com-comment>
    </div>
  </div>
</template>

<script>
// 导入子组件
import ComComment from './components/com-comment'
// 关注与取消关注api
import { apiUserFollow, apiUserUnfollow } from '@/api/user.js'
// 获取文章详情api
import { apiArticleDetail } from '@/api/article.js'
export default {
  name: 'article-index',
  components: { ComComment },
  data () {
    return {
      article: {}, // 目标文章详情信息
      followLoading: false
    }
  },
  created () {
    this.getArticleDetail()
  },
  methods: {
    // 关注作者
    async followMe () {
      // 开启加载动画
      this.followLoading = true
      // 延迟时间
      await this.$sleep(1000)
      if (this.article.is_followed) {
        // 取消关注
        await apiUserUnfollow(this.article.aut_id.toString())
        // 页面更新数据，使得响应式执行
        this.article.is_followed = false
      } else {
        // 关注
        // target 后台需要的被关注的用户id
        try {
          const target = this.article.aut_id.toString()
          await apiUserFollow({ target })
          this.article.is_followed = true // 不会有错误
        } catch (e) {
          if (e.response.status === 400) {
            // return 就是停止后续代码执行
            this.$toast.fail('自己不能关注自己！')
          } else {
            this.$toast.fail('关注失败，请联系管理员')
          }
        }
      }
      // 回复按钮状态
      this.followLoading = false
    },
    // 获取文章详情
    async getArticleDetail () {
      const articleId = this.$route.params.aid
      const res = await apiArticleDetail(articleId)
      // console.log(res)
      this.article = res
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top: 92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
