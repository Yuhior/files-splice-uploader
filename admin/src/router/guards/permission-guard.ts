import { useAppStore, useAuthStore, usePermissionStore, useRouterStore, useUserStore } from '@/stores'
import { getAppVars, getPermissions, getUserInfo } from '@/stores/helpers'


const WHITE_LIST = ['/login', '/404', '/n', '/r','/t']

export function createPermissionGuard(router) {
	router.beforeEach(async (to) => {
		const authStore = useAuthStore()
		const token = authStore.accessToken
		/** 没有token */
		if (!token) {
			if (WHITE_LIST.some(path => to.path.startsWith(path))) return true
			return { path: 'login', query: { ...to.query, redirect: to.path } }
		}
		// 有token的情况
		if (to.path === '/login') return { path: '/' }
		if (WHITE_LIST.some(path => to.path.startsWith(path))) return true

		const userStore = useUserStore()
		const permissionStore = usePermissionStore()
		const appStore = useAppStore()
		if (!userStore.userInfo) {
			const [user, permissions,vars] = await Promise.all([getUserInfo(), getPermissions(),getAppVars()])
			userStore.setUser(user)
			permissionStore.setPermissions(permissions)
			appStore.setAppVars(vars)
			const routeComponents = import.meta.glob('@/views/**/*.vue')
			// permissionStore.accessRoutes.forEach((route) => {
			//     route.component = routeComponents[route.component] || undefined
			//     !router.hasRoute(route.name) && router.addRoute(route)
			// })
			return { ...to, replace: true }
		}
		const routes = router.getRoutes()
		console.log(routes, '路由信息')
		// 非菜单路由 判断权限
		const nonMenusPermissions = permissionStore.permissions.map((c) => c.value)

		if (to.meta.permission && !nonMenusPermissions.includes(to.meta.permission)) {
			return { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
		}

		if (routes.find((route) => route.name === to.name)) return true
		// 判断是无权限还是404
		const { data: hasMenu } = await api.validateMenuPath(to.path)
		return hasMenu
			? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
			: { name: '404', query: { path: to.fullPath } }
	})
}
