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

// 获取用户信息
export const apiUserInfo = data => createAPI('/app/v1_0/user', 'get', data)

// 获取用户个人资料-编辑资料的api
/**
 * 编辑资料：获得用户的资料信息，用于修改
 * 内部自动传递token，可以识别当前的用户
 */
export const apiUserProfile = data => createAPI('/app/v1_0/user/profile', 'get', data)

// 修改用户头像
export const apiUserPhoto = data => createAPI('/app/v1_0/user/photo', 'patch', data)

// 修改用户资料
export const apiUserSaveProfile = data => createAPI('/app/v1_0/user/profile', 'patch', data)
