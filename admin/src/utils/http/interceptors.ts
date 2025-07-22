import { resolveResError } from './helpers.js'
import { useAuthStore } from '@/stores'
import { AxiosRequestConfig } from 'axios'
import { ResultEnum } from '@/enums'

declare module 'axios' {
	//这里扩展里InternalAxiosRequestConfig类型
	interface AxiosRequestConfig<D = any> {
		needToken?: boolean
		needTip?: boolean
	}
}

export function setupInterceptors(axiosInstance) {
	function reqResolve(config: AxiosRequestConfig) {
		if (config.needToken === false) {
			return config
		}
		const { accessToken } = useAuthStore()

		config.data = config.data || {}
		if (accessToken) {
			// token: Bearer + xxx
			config.headers!.Authorization = accessToken
			config.data.token = accessToken
		}
		return config
	}

	function reqReject(error) {
		return Promise.reject(error)
	}

	const SUCCESS_CODES = [200, 1, 201]

	function resResolve(response) {
		const { data, status, config, statusText, headers } = response
		// if (headers['content-type']?.includes('json')) {
		// 	if (SUCCESS_CODES.includes(data?.result)) {
		// 		return Promise.resolve(data)
		// 	}
		// 	const code = data?.result ?? status
		//
		// 	const needTip = config?.needTip !== false
		//
		// 	// 根据code处理对应的操作，并返回处理后的message
		// 	const message = resolveResError(code, data?.message ?? statusText, needTip)
		//
		// 	return Promise.reject({ code, message, error: data ?? response })
		// }
		// return Promise.resolve(data ?? response)
		if (SUCCESS_CODES.includes(data?.result)) {
			return Promise.resolve(data)
		}
		const code = data?.result ?? status
		const needTip = config?.needTip !== false
		// 根据code处理对应的操作，并返回处理后的message
		const message = resolveResError(code, data?.message ?? statusText, needTip, {})
		return Promise.reject({ code, message, error: data ?? response })
	}

	async function resReject(error) {
		if (!error || !error.response) {
			const code = error?.result
			/** 根据code处理对应的操作，并返回处理后的message */
			const message = resolveResError(code, error.message, true, {})
			return Promise.reject({ code, message, error })
		}

		const { data, status, config } = error.response
		const code = data?.result ?? status

		const needTip = config?.needTip !== false
		if (code === ResultEnum.TOKEN_EXPIRED && !config.url.includes('/refresh')) {
			//排除下 '/refresh' 接口，也就是刷新失败不继续刷新。
			const res = await refreshToken()
			if (res.status === 200) {
				return axiosInstance(config) // 继续发送上一个请求
			} else {
				const message = resolveResError(code, data?.message ?? error.message, needTip, {})
				return Promise.reject({ code, message, error: error.response?.data || error.response })
			}
		} else {
			const message = resolveResError(code, data?.message ?? error.message, needTip, {})
			return Promise.reject({ code, message, error: error.response?.data || error.response })
		}
	}

	axiosInstance.interceptors.request.use(reqResolve, reqReject)
	axiosInstance.interceptors.response.use(resResolve, resReject)

	// 使用refreshToken 更新token
	async function refreshToken() {
		const authStore = useAuthStore()
		const res = await axiosInstance.post('/refreshToken', {
			refresh_token: authStore.refreshToken
		})
		authStore.setToken(res.data.token)
		return res
	}
}
