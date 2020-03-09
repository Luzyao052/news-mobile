import { createAPI } from '@/utils/request.js'

// 获取用户频道列表
export const apiUserChannel = data => createAPI('app/v1_0/user/channels', 'get', data)

// 获取全部频道
export const apiChannelAll = data => createAPI('/app/v1_0/channels', 'get', data)
