/**
 * @Author: Yuhior
 * @Date: 2024/12/25
 * @LastEditors: author
 * @Description: 获取系统参数
 */

import { request } from '@/utils/http'

export interface BasicResponseModel<T = any> {
	result: number
	message: string
	data: T
}

/**
 * 获取分类列表
 */

export const getCategoryList = () => request.get('/tags')
