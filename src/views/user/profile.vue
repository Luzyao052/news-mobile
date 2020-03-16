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
      <van-cell title="头像" is-link center @click="showPhoto=true">
        <van-image
          slot="default"
          round
          fit="cover"
          width="50"
          height="50"
          :src="userprofile.photo"
        />
      </van-cell>
      <!-- 隐藏状态的上传表单域
        ref：可以这样 this.$refs.mypic  方式获得到当前input的元素对象
        如果不通过ref，也可以通过其他方式获取，
        例如id  document.getElementById('pic')
        ref和id 方式获得的元素对象本质完全一样
        上传表单域自带click，不用声明
      -->
      <input type="file" ref="mypic" id="pic" @change="startUpload()" style="display:none;" />
      <van-cell title="名称" is-link :value="userprofile.name" @click="showName=true"></van-cell>
      <van-cell title="性别" is-link :value="userprofile.gender===0?'男':'女'" @click="showSex=true"></van-cell>
      <van-cell title="生日" is-link :value="userprofile.birthday" @click="showBirthday=true"></van-cell>
    </van-cell-group>
    <!-- 头像弹出层
        高度不配置，通过内容自动填充
    -->
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell title="本地相册选择图片" is-link @click="$refs.mypic.click()"></van-cell>
      <van-cell title="拍照" is-link></van-cell>
    </van-popup>
    <!-- 名称弹出层
        高度不配置，通过内容自动填充
    -->
    <van-popup v-model="showName" position="bottom" style="height:20%">
      <!-- 通过v-model把当前用户真实的名字表现出来
          .trim ： 自动去除左右空格
      -->
      <van-field v-model.trim="userprofile.name" type="text"></van-field>
    </van-popup>
    <!-- 性别弹出层(上拉菜单)
    -->
    <van-action-sheet v-model="showSex" :actions="sexMenus" @select="onSelect" cancel-text="取消" />
    <!-- 生日弹出层(弹出层+时间选择器) -->
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onConfirm"
        @cancel="showBirthday = false"
      />
    </van-popup>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { apiUserProfile, apiUserPhoto, apiUserSaveProfile } from '@/api/user.js'
export default {
  name: 'user-profile',
  data () {
    return {
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(),
      showBirthday: false, // 是否显示生日弹层
      // 给性别上拉菜单 配置选取项目，语法结构固定，name属性固定
      sexMenus: [{ name: '男' }, { name: '女' }],
      showSex: false, // 是否显示性别的上拉菜单
      showName: false, // 是否显示编辑昵称的弹层
      showPhoto: false, // 是否显示头像弹层
      userprofile: {}
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    // 修改头像
    async startUpload () {
      // console.dir(this.$refs.mypic)
      // 1. 获得上传好的图片对象
      const fobj = this.$refs.mypic.files[0]
      // 2. 把图片对象 整合到FormData
      const fd = new FormData()
      // fd整合fobj，调用append方法，不断给自己添加信息
      fd.append('photo', fobj) // photo 是接口文章要求的参数名称
      // 3. 把FormData给到api函数，提交给服务器端
      const res = await apiUserPhoto(fd)
      // console.log(res)
      this.userprofile.photo = res.photo
      // 关闭弹出
      this.showPhoto = false
      // 成功提示
      this.$toast.success('头像更新成功！')
    },
    // 日期
    onConfirm (val) {
      // console.log(val)
      this.userprofile.birthday = dayjs(val).format('YYYY-MM-DD')
      // 关闭弹出层
      this.showBirthday = false
    },
    // 性别
    onSelect (item) {
      // console.log(item) // {name:'男'}
      // 对item进行处理，然后赋值给data表单成员(其接受数字的性别)
      this.userprofile.gender = item.name === '男' ? 0 : 1
      // 隐藏菜单
      this.showSex = false
    },
    async getUserProfile () {
      const res = await apiUserProfile()
      // console.log(res)
      this.userprofile = res
      // 把用户生日转为 new Date()  格式，赋值给 currentDate
      // 使得选择器 默认显示
      this.currentDate = new Date(this.userprofile.birthday)
    },
    async save () {
      const obj = {
        name: this.userprofile.name,
        gender: this.userprofile.gender,
        birthday: this.userprofile.birthday
      }
      await apiUserSaveProfile(obj)
      // console.log(res)
      // 提示信息
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style scoped lang='less'></style>
