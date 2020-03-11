import { createAPI } from '@/utils/request.js'

// 搜索-获取联想建议（自动补全）
export const apiSearchSuggestion = data => createAPI('app/v1_0/suggestion', 'get', data)
