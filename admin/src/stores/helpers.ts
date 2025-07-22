import api from '@/api'
import { basePermissions } from '@/settings'

export async function getUserInfo() {
	const res = await api.getUserInfo()
	const { userId, userName, alias, avatar ,userType} = res.data.user_info || {}
	return {
		userId,
		userName,
		alias,
		userType,
		avatar: avatar || 'https://qnshow2022.oss-cn-beijing.aliyuncs.com/static/ic_personal_apply.png'
	}
}

export async function getPermissions() {
	let asyncPermissions = []
	try {
		const res = await api.getUserPermission()
		asyncPermissions = res?.data || []
	} catch (error) {
		console.error(error)
	}
	return basePermissions.concat(asyncPermissions)
}

export async function getAppVars() {
	let vars = {}
	try {
		const response = await api.getAppVars()
		vars = response.data
	} catch (error) {
		console.log('error', error)
	}
	return vars
}

// export async function getMenus() {
//     const res = await api.getRoleMenus()
//     return res.data
// }
