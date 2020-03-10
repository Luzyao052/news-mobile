import { createAPI } from '@/utils/request.js'
import store from '@/store/index.js'
const CHANNEL_KEY_TRAVEL = 'hm-channel-travel' // 游客key
const CHANNEL_KET_VIP = 'hm-channel-vip' // 登录用户Key
/**
 * 获取用户的频道列表数据
 * 一般数据获取请求方式都是get
 * 当前函数不要传递参数(从【接口文档】可知)
 *
 * 应用端明确要求如下函数返回"Promise对象"结果
 * 给函数前边设置async，那么这个函数return返回结果以"Promise对象"形式体现
 */
// 获取用户频道列表
export const apiUserChannel = async (data) => {
  // 1. 从缓存localStorage里边获得频道(注意区分用户是否有登录系统)
  // 根据用户是否登录系统获得对应的localStorage操作的key
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
  // 读取缓存的频道数据:null  实体字符串
  // 频道数据在localStorage中存储的样子：[{id:xx,name:xx},{id:xx,name:xx},{id:xx,name:xx},……]
  // 是“数组对象集”，但是类型是字符串
  const cacheChannels = localStorage.getItem(key)
  // 2. 判断是否有缓存频道数据
  if (cacheChannels) {
    // 有数据，直接返回应用
    return { channels: JSON.parse(cacheChannels) }
  } else {
    // 没有数据，就走axios获得数据应用
    // 注意：request前边需要设置await，保证同步执行，后续代码可以正常获得rst结果
    const res = await createAPI('app/v1_0/user/channels', 'get', data)
    // console.log(res)
    // 把获得好的数据存储给localStorage，以便下次使用
    localStorage.setItem(key, JSON.stringify(res.channels))
    // 数据对外输出应用即可
    return res
  }
}

// 获取全部频道
export const apiChannelAll = data => createAPI('/app/v1_0/channels', 'get', data)

// 添加频道
export const apiChannelAdd = async (data) => {
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
  const cacheChannels = JSON.parse(localStorage.getItem(key))
  cacheChannels.push(data)
  localStorage.setItem(key, JSON.stringify(cacheChannels))
  // 上述代码都是非常ok的，本身不需要返回任何信息(应用端也不需要)，就返回null即可
  return null
}

// 删除频道
export const apiChannelDel = async (data) => {
  const key = store.state.user.token ? CHANNEL_KET_VIP : CHANNEL_KEY_TRAVEL
  const cacheChannels = JSON.parse(localStorage.getItem(key))
  // cacheChannels.splice(index, 1)
  const tmpChannels = cacheChannels.filter(item => {
    // item: 代表遍历出来的每个数组元素单元
    // 判断当前项目如果“不是” channel 就收集,
    // 内部return接收true就收集当前数值元素项目，接收false就抛弃
    return data.id !== item.id
  })
  localStorage.setItem(key, JSON.stringify(tmpChannels))
  return null
}
