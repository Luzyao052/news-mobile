import { createAPI } from '@/utils/request.js'

// 获取用户频道列表
export const apiUserChannel = data => createAPI('app/v1_0/user/channels', 'get', data)
