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
 * 获取行为验证图片
 * @param data {}
 */
export const getRobotVerify = (data) => request.post('/captcha', data, { needToken: false })
/**
 * 验证行为验证真实性
 * @param data {captchaToken、pointJson: }
 */
export const checkRobotVerify = (data) => request.post('/captchaCheck', data, { needToken: false })
/**
 * 密码登陆
 * @param data
 */
export const loginByPass = (data) => request.post('/loginByPassword', data, { needToken: false })
