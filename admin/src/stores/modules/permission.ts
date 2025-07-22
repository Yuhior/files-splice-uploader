import { defineStore } from 'pinia'

interface Permission {
	id: number
	value: string
}

export const usePermissionStore = defineStore(
	'permission',
	() => {
		const permissions = ref<Permission[]>([])

		function setPermissions(permissions) {
			permissions.value = permissions
		}

		function resetPermission() {
			permissions.value = []
		}

		return { permissions, setPermissions, resetPermission }
	},
	{
		persist: {
			key: 'qn-permission',
			pick: ['permission'],
			debug: true
		}
	}
)
