import { createAPI } from '@/utils/request.js'
import store from '@/store/index.js'
// 搜索-获取联想建议（自动补全）
export const apiSearchSuggestion = data => createAPI('app/v1_0/suggestion', 'get', data)

// 搜索-获取搜索结果
export const apiSearchList = data => createAPI('/app/v1_0/search', 'get', data)

// 获取用户搜索历史
export const apiSearchHistory = async (data) => {
  const key = 'suggest-histories'
  if (store.state.user.token) {
    const res = await createAPI('/app/v1_0/search/histories', 'get', data)
    // console.log(res)
    return res.keywords
  } else {
    const searchHistory = JSON.parse(localStorage.getItem(key) || '[]')
    return searchHistory
    // 把当前的关键字存储起来，还要考虑去除重复
    // const sh = new Set(searchHistory)
    // sh.add(data)
    // const searchHistoryList = Array.from(sh)
    // return searchHistoryList
    // localStorage.setItem(key, JSON.stringify(searchHistoryList))
    // const searchHistoryLists = JSON.parse(searchHistoryList)
    // return searchHistoryLists
  }
}

// 删除用户搜索历史
export const apiSearchHistoryDel = data => {
  const key = 'suggest-histories'
  if (store.state.user.token) {
    return createAPI('/app/v1_0/search/histories', 'delete')
  } else {
    localStorage.removeItem(key)
  }
}
