import { createAPI } from '@/utils/request.js'

// 添加评论或回复
export const apiAddCorR = data => createAPI('/app/v1_0/comments', 'post', data)
