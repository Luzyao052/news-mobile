import { createAPI } from '@/utils/request.js'

// 用户界面登录
// export const apiUserLogin = data => {
//   return createAPI('app/v1_0/authorizations', 'post', data)
// }
// 用户界面登录
export const apiUserLogin = data => createAPI('app/v1_0/authorizations', 'post', data)
