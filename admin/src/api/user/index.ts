/**
 * @Author: Yuhior
 * @Date: 2024/12/3
 * @LastEditors: author
 * @Description: desc
 */

import { request } from '@/utils/http'

export interface BasicResponseModel<T = any> {
	result: number
	message: string
	data: T
}

/**
 * 获取用户信息
 * @param data {}
 */
export const getUserInfo = (data) => request.post('/ApiHandler', { ...data, p0_cmd: 'user_pullUser' },{
	baseURL: import.meta.env.VITE_AXIOS_USER_URL,
})
/**
 * 获取用户permission
 * @param data {captchaToken、pointJson: }
 */
export const getUserPermission = (data) => request.post('/ApiHandler', { ...data, p0_cmd: 'user_pullPermission' },{
	baseURL: import.meta.env.VITE_AXIOS_USER_URL,
})
