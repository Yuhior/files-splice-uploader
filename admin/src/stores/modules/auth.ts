import { defineStore } from 'pinia'
import { usePermissionStore, useRouterStore, useUserStore } from '@/stores'

export const useAuthStore = defineStore(
	'auth',
	() => {
		const accessToken = ref(localStorage.getItem('access_token') || '')
		const refreshToken = ref(localStorage.getItem('refresh_token') || '')
		// 判断登录状态
		const isLoggedIn = computed(() => !!accessToken.value)

		function setToken({ token }) {
			accessToken.value = token
		}

		function setRefreshToken({ refreshToken: newRefreshToken }) {
			refreshToken.value = newRefreshToken
		}

		function resetToken() {
			accessToken.value = ''
			refreshToken.value = ''
		}

		function toLogin() {
			const { router, route } = useRouterStore()
			router.replace({
				path: '/login',
				query: route.query
			})
		}

		function resetLoginState() {
			const { resetUserInfo } = useUserStore()
			const { resetRouter } = useRouterStore()
			const { resetPermission } = usePermissionStore()
			// 重置路由
			resetRouter([])
			// 重置用户
			resetUserInfo()
			// 重置权限
			resetPermission()
			// 重置Tabs
			// resetTabs()
			//重置token
			resetToken()
		}

		function logout() {
			resetLoginState()
			toLogin()
		}

		return { accessToken, logout, setToken, isLoggedIn, refreshToken, setRefreshToken }
	},
	{
		persist: [
			{
				key: 'access_token',
				pick: ['accessToken'],
				serializer: {
					// 自定义序列化，使其存储为字符串而非 JSON 对象
					serialize: (value) => (value && value.accessToken ? value.accessToken : ''),
					deserialize: (value) => ({ accessToken: value || '' })
				},
				debug: true
			},
			{
				key: 'refresh_token',
				pick: ['refreshToken'],
				serializer: {
					serialize: (value) => (value && value.refreshToken ? value.refreshToken : ''),
					deserialize: (value) => ({ refreshToken: value || '' })
				},
				debug: true
			}
		]
	}
)
