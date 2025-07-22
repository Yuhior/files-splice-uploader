<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleLogin = () => {
	// 这里处理登录逻辑
	console.log('Login attempt', { email: email.value, password: password.value })
}
</script>

<template>
	<div class="min-h-screen w-full bg-white flex items-center justify-center p-16">
		<div class="w-full max-w-448 text-14">
			<h1 class="text-30 font-bold text-gray-800 mb-32 text-center">欢迎登录</h1>
			<form @submit.prevent="handleLogin" class="bg-white card-shadow rounded-8 p-32">
				<div class="mb-24">
					<label for="email" class="block text-gray-700 text-14 font-bold mb-8">邮箱</label>
					<input
						type="email"
						id="email"
						v-model="email"
						class="w-full text-14 px-12 py-10 b-solid b-1 border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent transition"
						placeholder="请输入您的邮箱"
						required
					>
				</div>
				<div class="mb-24">
					<label for="password" class="block text-gray-700 text-14 font-bold mb-8">密码</label>
					<input
						type="password"
						id="password"
						v-model="password"
						class="w-full text-14 px-12 py-10 b-solid  b-1 border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-transparent transition"
						placeholder="请输入您的密码"
						required
					>
				</div>
				<div class="flex items-center justify-between mb-24">
					<div class="flex items-center">
						<input type="checkbox" id="remember" class="mr-8">
						<label for="remember" class="text-14 text-gray-600">记住我</label>
					</div>
					<a href="#" class="text-14 text-green-600 hover:text-green-800 transition">忘记密码？</a>
				</div>
				<button
					type="submit"
					class="w-full bg-[#42bc7f] text-white b-primary b-solid font-bold py-8 px-16 rounded-6 cursor-pointer hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
				>
					登录
				</button>
			</form>
			<p class="text-center mt-32 text-14 text-gray-600">
				还没有账号？ <a href="#" class="text-[#42bc7f] hover:text-[#3aa76f] font-semibold">立即注册</a>
			</p>
		</div>
	</div>
</template>

<style scoped lang="scss">
input{outline: none;}
</style>
