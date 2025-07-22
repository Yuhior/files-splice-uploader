let loadingInstance = null //当前加载实例
let loadingRequestCount = 0

const showLoading = (options = {}) => {
	if (!loadingInstance && loadingRequestCount === 0) {
		loadingInstance = ElLoading.service({
			lock: true, // 锁定屏幕
			text: options.text || '加载中...', // 自定义提示文字
			background: options.background || 'rgba(0,0,0,0.7)', // 自定义背景颜色
			spinner: options.spinner || null, // 加载动画
			fullscreen: true
		})
	}
	loadingRequestCount++
}

// 隐藏加载动画
const hideLoading = () => {
	if (loadingRequestCount <= 0) return
	loadingRequestCount--
	if (loadingInstance && loadingRequestCount === 0) {
		loadingInstance.close()
		loadingInstance = null
	}
}
export const useWithLoading = (fn, options = {}) => {
	const newFn = async (...args) => {
		try {
			showLoading(options)
			const result = await fn(...args)
			hideLoading()
			return result
		} catch (err) {
			hideLoading()
			throw err
		}
	}
	return newFn
}
