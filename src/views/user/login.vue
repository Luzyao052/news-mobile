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
      <van-button type="info" size="small" round block @click="login">登录</van-button>
    </div>
  </div>
</template>

<script>
import { apiUserLogin } from '@/api/user'
export default {
  name: 'user-login',
  data () {
    return {
      // 登录表单数据对象
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      }
    }
  },
  methods: {
    async login () {
      try {
        // apiUserLogin函数执行有可能成功、也有可能失败，请try、catch判断使用
        const res = await apiUserLogin(this.loginForm)
        // api函数执行成功代表账号正确
        // 如果报400的错误信息，代表账号错误，并且是致命错误，会阻止后续程序代码运行
        // 因此，判断账号是否正确，不用通过result返回值，需要try/catch介入
        // console.log(result) // {token:xx,refresh_token:xx}
        // 通过vuex维护服务器端返回的token等秘钥信息
        this.$store.commit('updateUser', res)
      } catch (e) {
        // 账号错误，$toast.fail()是vant组件库的"错误提示"应用语法
        // 与之前的 $message.error()是对应的
        // return 表示停止后续代码执行
        return this.$toast.fail('用户名或密码错误' + e)
      }
      this.$toast.success('登录成功')
      this.$router.push('/') // 项目首页面
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
