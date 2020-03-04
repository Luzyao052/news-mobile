<template>
  <div class="user-login">
    <van-nav-bar left-arrow @click-left="$router.back()" title="登录"></van-nav-bar>
    <!-- 表单部分
      vant里边没有form相关组件，只有普通表单域组件
      van-cell-group是对普通表单域组件做封装
    -->
    <van-cell-group>
      <!--van-field 输入框表单域组件
        label="手机号" 表单域前边的名字设置
        required：不进行校验，设置表单域前边有"红星"
        clearable：表单域内容可以通过右侧“叉号”清除
      -->
      <van-field
        required
        clearable
        v-model="loginForm.mobile"
        type="tel"
        label="手机号"
        placeholder="请输入手机号码"
      />
      <van-field
        required
        v-model="loginForm.code"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
      >
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn">
      <!--van-button
        type:按钮背景颜色,info是蓝色
        size:按钮大小的
        round：圆边效果
        block：块级样式设置，占据一行
      -->
      <van-button type="info" size="small" round block>登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-login',
  data () {
    return {
      // 登录表单数据对象
      loginForm: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 登录按钮样式
.login-btn {
  margin: 40px;
}
</style>
