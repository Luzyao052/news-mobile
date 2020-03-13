import { createAPI } from '@/utils/request.js'

// 用户界面登录
// export const apiUserLogin = data => {
//   return createAPI('app/v1_0/authorizations', 'post', data)
// }
// 用户界面登录
export const apiUserLogin = data => createAPI('app/v1_0/authorizations', 'post', data)

// 关注用户
export const apiUserFollow = data => createAPI('/app/v1_0/user/followings', 'post', data)

// 取消关注
export const apiUserUnfollow = data => createAPI(`/app/v1_0/user/followings/${data}`, 'delete')
