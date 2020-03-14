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
          :src="userprofile.photo"
        />
      </van-cell>
      <van-cell title="名称" is-link :value="userprofile.name"></van-cell>
      <van-cell title="性别" is-link :value="userprofile.gender===0?'男':'女'"></van-cell>
      <van-cell title="生日" is-link :value="userprofile.birthday"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { apiUserProfile } from '@/api/user.js'
export default {
  name: 'user-profile',
  data () {
    return {
      userprofile: {}
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    async getUserProfile () {
      const res = await apiUserProfile()
      // console.log(res)
      this.userprofile = res
    },
    save () {
      // 提示信息
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
