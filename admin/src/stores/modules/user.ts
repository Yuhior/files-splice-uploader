import { defineStore } from 'pinia'

interface UserInfo {
	userId: string
	userName: string
	avatar: string
	alias: string
	userType: number
}

export const useUserStore = defineStore(
	'user',
	() => {
		const userInfo = ref<UserInfo | null>(null)
		function setUserInfo(user) {
			userInfo.value = user
		}
		function userId() {
			// 确保userInfo存在且包含有效的userId
			if (!userInfo.value || !userInfo.value.userId) {
				return null
			}
			return userInfo.value.userId
		}
		function userType() {
			// 确保userInfo存在且包含有效的userId
			if (!userInfo.value || !userInfo.value.userType) {
				return null
			}
			return userInfo.value.userType
		}

		function userName() {
			return userInfo.value?.userName
		}

		function setUser(user) {
			userInfo.value = user
		}

		function resetUserInfo() {
			userInfo.value = null
		}

		return { userInfo, userId, userName, setUser, resetUserInfo, setUserInfo,userType }
	},
	{
		persist: {
			key: 'userStore',
			pick: ['userInfo'],
			debug: true
		}
	}
)
