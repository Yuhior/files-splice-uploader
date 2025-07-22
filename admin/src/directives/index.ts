import createLoading from '@/components/QnLoading/index'

const permission = {
	mounted(el, binding) {
		const permissionStore = usePermissionStoreWidthOut()
		const btnsPermissions = permissionStore.permissions.map(c => c.value)
		// const currentRoute = unref(router.currentRoute)
		// const btns = currentRoute.meta?.btns?.map(item => item.code) || []
		if (!btnsPermissions.includes(binding.value)) {
			el.remove()
		}
	}
}
// 创建自定义指令
const qnLoading = {
	mounted(el, binding) {
		if (binding.value === true) {
			createLoading(el)
		}
	},
	//update的时候
	updated(el, binding) {
		//v-loading 的值为false，并且该节点下最后一个元素是loading时，移除节点
		if (binding.value === false && el.lastChild.dataset && el.lastChild.dataset.v === 'loading') {
			el.removeChild(el.lastChild)
			return
		}
		//v-loading 的值为true，并且该节点下没有loading节点时，调用函数，挂载loading
		if (binding.value === true && el.lastChild.dataset && el.lastChild.dataset.v !== 'loading') {
			createLoading(el)
		}
	}
}

export function setupDirectives(app) {
	app.directive('permission', permission)
	app.directive('qnloading', qnLoading)
}
