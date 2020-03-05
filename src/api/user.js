import { createAPI } from '@/utils/request.js'

// 用户界面登录
// export const apiUserLogin = data => {
//   return createAPI('app/v1_0/authorizations', 'post', data)
// }
// 用户界面登录
export const apiUserLogin = data => createAPI('app/v1_0/authorizations', 'post', data)

// 获取用户文章列表
export const apiUserArticle = data => createAPI(`app/v1_0/users/${data.id}/articles`, 'get', data)
