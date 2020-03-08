<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      :show-confirm-button="false"
      close-on-click-overlay
      @closed="isOneLevel=true"
    >
      <van-cell-group v-if="isOneLevel">
        <van-cell title="不感兴趣" icon="location-o" @click="dislike" />
        <van-cell title="反馈垃圾内容" icon="location-o" is-link @click="isOneLevel=false" />
        <van-cell title="拉黑作者" icon="location-o" />
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isOneLevel=true"></van-cell>
        <van-cell title="其他问题" icon="location-o"></van-cell>
        <van-cell title="标题夸张" icon="location-o"></van-cell>
        <van-cell title="低俗色情" icon="location-o"></van-cell>
        <van-cell title="错别字多" icon="location-o"></van-cell>
        <van-cell title="旧闻重复" icon="location-o"></van-cell>
        <van-cell title="广告软文" icon="location-o"></van-cell>
        <van-cell title="内容不实" icon="location-o"></van-cell>
        <van-cell title="涉嫌违法犯罪" icon="location-o"></van-cell>
        <van-cell title="侵权" icon="location-o"></van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入api
import { apiArticleDislike } from '@/api/article.js'
export default {
  name: 'com-moreaction.vue',
  props: ['value', 'articlID'],
  data () {
    return {
      isOneLevel: true
    }
  },
  methods: {
    // 不喜欢的文章
    async dislike () {
      const obj = {
        target: this.articlID
      }
      await apiArticleDislike(obj)
      // console.log(res)
      this.$toast.success('操作成功')
      // 关闭弹出框,修改父组件的showDialog的值为false，进而影响子组件关闭弹框
      this.$emit('input', false)
      // 调用自己的事件，使得父组件页面文章清除
      this.$emit('dislikeSuccess')
    }
  }
}
</script>

<style scoped lang='less'></style>
