<script setup lang="ts">
import { useAuthStore } from '@/stores'
import LoginForm from '@/views/login/components/LoginForm.vue'
import api from '@/api'
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const loginMode = ref('login')
const loginParam = ref({
	username: '',
	password: ''
})

const loading = ref(false)

async function handleLogin(verifyParam) {
	loading.value = true
	try {
		const response = await api.loginByPass({ ...verifyParam, ...loginParam.value })
		onLoginSuccess(response.data)
	} catch (e) {
		console.log(e.message)
	} finally {
		loading.value = false
	}
}
interface LoginData {
	token: string;
	refreshToken: string;
}
async function onLoginSuccess(data: LoginData) {
	authStore.setToken(data)
	authStore.setRefreshToken(data)
	try {
		ElNotification({
			title: '提示',
			message: '登陆成功',
			type: 'success',
		})
		if (route.query.redirect) {
			const path = route.query.redirect
			delete route.query.redirect
			router.push({ path, query: route.query })
		} else {
			router.push('/')
		}
	} catch (error) {
		console.error(error)
		$message.destroy('login')
	}
}
</script>

<template>
	<div class="min-h-screen w-full bg-white flex items-center justify-center p-16">
		<LoginForm v-if="loginMode === 'login'" v-model="loginParam" :loading="loading" @on-login="handleLogin" />
	</div>
</template>

<style scoped></style>
