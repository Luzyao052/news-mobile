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
        <van-cell
          :title="item.title"
          icon="location-o"
          v-for="item in reportList"
          :key="item.value"
          @click="articleReport(item.value)"
        ></van-cell>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入api
import { apiArticleDislike, apiArticleReport } from '@/api/article.js'
export default {
  name: 'com-moreaction.vue',
  props: ['value', 'articlID'],
  data () {
    return {
      // 文章举报类型明细
      reportList: [
        { title: '其他问题', value: 0 },
        { title: '标题夸张', value: 1 },
        { title: '低俗色情', value: 2 },
        { title: '错别字多', value: 3 },
        { title: '旧闻重复', value: 4 },
        { title: '广告软文', value: 5 },
        { title: '内容不实', value: 6 },
        { title: '涉嫌违法犯罪', value: 7 },
        { title: '侵权', value: 8 }
      ],
      isOneLevel: true
    }
  },
  methods: {
    // 举报文章
    async articleReport (val) {
      try {
        const obj = {
          target: this.articlID,
          type: val,
          remark: ''
        }
        await apiArticleReport(obj)
      } catch (e) {
        if (e.response.status === 409) {
          // return:停止后续代码的执行
          return this.$toast.fail('文章已经被举报了')
        }
      }
      // 提示成功
      this.$toast.success('文章举报成功')
      // 关闭弹出框
      this.$emit('input', false)
    },
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
