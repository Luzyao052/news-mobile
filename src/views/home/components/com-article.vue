<template>
    <!-- div的作用是给瀑布流区域设置“垂直滚动条”，使得可以进行上拉操作 -->
    <div class="scroll-wrapper">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- van-cell单元格组件
        特点：独占一行
        用法非常灵活、复杂
        title：单元格标题内容
      -->
        <van-cell v-for="item in list" :key="item" :title="item" />
      </van-list>
    </div>
</template>

<script>
export default {
  name: 'com-article',
  data () {
    return {
      // 瀑布流相关成员
      list: [], // 数据源
      loading: false, // 瀑布流是否加载处于动画效果
      finished: false // 瀑布流是否停止
    }
  },
  methods: {
    onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='less'>
.scroll-wrapper{
      height: 100%;
      // 瀑布流区域如果垂直方向内容过多，要呈现滚动条
      // 是瀑布实现的关键要素
      overflow-y: auto;
    }
</style>
