<script setup lang="ts">
import { extractCaptchaData } from '@/components/RobotCaptch/core/ase'
type Props = {
	loading?: boolean,
}
withDefaults(defineProps<Props>(),{
	loading:false
})

const loginForm = defineModel()
console.log(loginForm.value)
const emit = defineEmits(['on-login'])
const rules = {
	username: [{ required: true, message: '请填写您的手机号', trigger: 'blur' }],
	password: [{ required: true, message: '请填写您的密码', trigger: 'blur' }]
}
const captchaType = ref('')
const isNotRobot = ref(false)
const verifyResponse = ref(null)
const encryptCode = ref('')

const loginFormRef = ref(null)
const robotVerifyRef = ref(null)

function onShowRobotVerify(type) {
	loginFormRef.value.validate(async (valid) => {
		if (valid) {
			captchaType.value = type
			robotVerifyRef.value.show()
		}
	})
}

function robotVerifySuccess(res) {
	verifyResponse.value = extractCaptchaData(res.captchaVerification, res.secretKey)
	encryptCode.value = res.captchaVerification
	robotVerifyRef.value.closeBox()
	captchaType.value = ''
	isNotRobot.value = true
	onLogin()
}

function onLogin() {
	loginFormRef.value.validate(async (valid) => {
		if (valid) {
			const { checkPosArr, backToken } = verifyResponse.value
			emit('on-login', {
				pointJson: checkPosArr,
				captchaToken: backToken,
				encryptCode: encryptCode.value
			})
		} else {
			ElMessage.error('请输入手机号/用户名和密码')
		}
	})
}
</script>

<template>
	<div class="w-full max-w-448 text-14">
		<h1 class="text-30 font-bold text-gray-800 mb-32 text-center">欢迎回来</h1>
		<el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="space-y-24">
			<el-form-item prop="username">
				<label for="username" class="block text-14 font-medium text-gray-700">手机号</label>
				<input
					type="text"
					id="username"
					v-model="loginForm.username"
					class="w-full text-14 px-12 py-10 b-solid b-1 border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					placeholder="请输入您的手机号"
				/>
			</el-form-item>

			<el-form-item prop="password">
				<label for="password" class="block text-14 font-medium text-gray-700">密码</label>
				<input
					id="password"
					v-model="loginForm.password"
					type="password"
					class="w-full text-14 px-12 py-10 border b-solid border-gray-300 rounded-6 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
					placeholder="请输入您的密码"
				/>
			</el-form-item>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						type="checkbox"
						class="h-16 w-16 text-green-600 focus:ring-green-500 border-gray-300 rounded"
					/>
					<label for="remember-me" class="ml-8 block text-14 leading-20 text-gray-700"
						>Remember me</label
					>
				</div>

				<div class="text-14">
					<a href="#" class="font-medium text-green-600 hover:text-green-500">忘记密码?</a>
				</div>
			</div>

			<el-button
				type="primary"
				:loading="loading"
				class="w-full flex justify-center py-20 cursor-pointer px-8 border border-transparent rounded-6 shadow-sm text-14 font-medium text-white bg-green-600 hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				@click="onShowRobotVerify('clickWord')"
			>
				登陆
			</el-button>
		</el-form>
		<p class="mt-32 text-center text-14 text-gray-600">
			Not a member?
			<a href="#" class="font-medium text-green-600 hover:text-green-500"
				>Start a 14 day free trial</a
			>
		</p>
	</div>
	<RobotCaptch
		ref="robotVerifyRef"
		mode="pop"
		:captchaType="captchaType"
		:imgSize="{ width: '400px', height: '200px' }"
		@success="robotVerifySuccess"
	/>
</template>

<style scoped></style>
