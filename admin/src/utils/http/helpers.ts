import { useAuthStore } from '@/stores'
import { ResultEnum } from '@/enums'

let isConfirming = false

export function resolveResError(code, message, needTip = true, config) {
	switch (code) {
		case ResultEnum.TOKEN_EXPIRED:
			if (isConfirming || !needTip) return
			isConfirming = true
			ElMessageBox.confirm('登录已过期，是否重新登录？', '提示', {
				confirmButtonText: '去登录',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					useAuthStore().logout()
					ElMessage({
						type: 'success',
						message: '已退出登录'
					})
					isConfirming = false
				})
				.catch(() => {
					isConfirming = false
				})
			return false
		case 11007:
		case 11008:
			if (isConfirming || !needTip) return
			isConfirming = true
			ElMessageBox.confirm(`${message}，是否重新登录？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info'
			})
				.then(() => {
					useAuthStore().logout()
					ElMessage({
						type: 'success',
						message: '已退出登录'
					})
					isConfirming = false
				})
				.catch(() => {
					isConfirming = false
				})
			return false
		case 403:
			message = '请求被拒绝'
			break
		case 404:
			message = '请求资源或接口不存在'
			break
		case 500:
			message = '服务器发生异常'
			break
		default:
			message = message ?? `【${code}】: 未知异常!`
			break
	}
	needTip && ElMessage.error(message)
	return message
}
