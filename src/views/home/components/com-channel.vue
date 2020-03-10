<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    close-icon-position="top-left"
    round
    position="bottom"
    :style="{ height: '95%' }"
    @closed="isEdit=false"
  >
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button type="danger" plain size="mini" round @click="isEdit=!isEdit">
            {{isEdit?'完成':'编辑'}}
          </van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="(item,index) in channelList" :key="item.id">
          <span class="text" :style="{color:activeChannelIndex===index?'red':''}">{{item.name}}</span>
          <van-icon class="close-icon" name="close" v-show="isEdit && index>0" @click="userToRest(item,index)" />
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
// 导入api
import { apiChannelAll, apiChannelAdd, apiChannelDel } from '@/api/channel'
export default {
  name: 'com-channel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    channelList: {
      // 我的频道
      type: Array,
      default: () => []
    },
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      isEdit: false, // 是否进入编辑状态 true/false
      channelAll: [] // 全部频道数据
    }
  },
  created () {
    this.getChannelAll()
  },
  methods: {
    // 删除频道到全部频道
    userToRest (channel, index) {
      this.channelList.splice(index, 1)
      apiChannelDel(channel)
    },
    // 添加频道到我的频道
    restToUser (channel) {
      this.channelList.push(channel)
      apiChannelAdd(channel)
    },
    // 全部文章
    async getChannelAll () {
      const res = await apiChannelAll()
      // console.log(res)
      this.channelAll = res.channels
    }
  },
  computed: {
    // 获取剩余频道
    restChannel () {
      const userChannelIDs = this.channelList.map(item => {
        return item.id
      })
      //    数组.filter()  过滤方法，把符合条件的数组元素通过“新数组”给与返回
      //    (全部频道 去除 我的频道 给与返回)
      const rest = this.channelAll.filter(item => {
        // 我的频道  里边不包含当前项目，就给与收集
        // 判断我的频道id集合 是否包含当前项目，不包含的才收集
        // 数组.includes(元素)  判断数组中是否有出现某个元素，返回Boolean
        return !userChannelIDs.includes(item.id)
      })
      return rest
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
