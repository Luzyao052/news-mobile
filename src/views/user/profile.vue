<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save()"
    ></van-nav-bar>
    <!-- 绘制 头像、名称、性别、生日 的单元格 -->
    <van-cell-group>
      <van-cell title="头像" is-link center>
        <van-image
          slot="default"
          round
          fit="cover"
          width="50"
          height="50"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <van-cell title="名称" is-link value="蜡笔大新"></van-cell>
      <van-cell title="性别" is-link value="女"></van-cell>
      <van-cell title="生日" is-link value="2018-03-09"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'user-profile',
  methods: {
    save () {
      // 提示信息
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
