/**
 * @Author: Yuhior
 * @Date: 2024/12/26
 * @LastEditors: author
 * @Description: 文件上传
 */

import {request} from '@/utils/http'
import {useAuthStore} from '@/stores'

// 上传文件的请求函数
export const uploadFile = (file, params = {}) => {
	const {accessToken} = useAuthStore()
	const formData = new FormData()
	formData.append('file', file) // 上传字段为 'file'
	formData.append('token', accessToken)
	// 如果有其他的额外参数，添加到 FormData 中
	Object.keys(params).forEach((key) => {
		if (key !== 'onUploadProgress') {
			formData.append(key, params[key])
		}
	})
	return request.post('/upload', formData, {
		headers: {
			'Content-Type': 'multipart/form-data' // 必须设置为 multipart/form-data
		},
		onUploadProgress: (progressEvent) => {
			const percentCompleted = Math.round((progressEvent.loaded ) / progressEvent.total)
			if (params.onUploadProgress) {
				params.onUploadProgress({percent: percentCompleted})
			}
		}
	})
}

export const autoUpload = () => {
	const {accessToken} = useAuthStore()
	return {
		url: '/uploadFile',
		data: {
			token: accessToken,
		}
	}
}

export const checkChuncks = (data) => request.post('/checkChuncks', data)
export const merge = (data) => request.post('/merge', data)
