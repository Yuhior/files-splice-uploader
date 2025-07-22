<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Header -->
		<header class="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
			<div class="container mx-auto px-4 py-16 flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<i class="i-lucide:code-xml text-24"></i>
					<h1 class="text-20 font-bold text-gray-800 dark:text-white">大文件分片上传</h1>
				</div>

				<div class="flex items-center space-x-4">
					<el-button @click="toggleTheme" class="p-2 hover: dark:hover:bg-gray-700 transition">
						<i
							class="i-material-symbols:wb-sunny-outline-rounded text-gray-600 dark:text-gray-300"
							v-if="isDark"
						></i>
						<i
							class="i-material-symbols:dark-mode-outline-rounded text-gray-600 dark:text-gray-300"
							v-else
						></i>
					</el-button>
				</div>
			</div>
		</header>

		<!-- Main content -->
		<main class="container mx-auto px-4 py-8">
			<el-upload
				class="button-uploader"
				ref="uploadButton"
				:auto-upload="false"
				:accept="accept"
				:show-file-list="false"
				:limit="limit"
				multiple
				:on-change="onSelectResourceFile"
				:on-error="onErrorUpload"
				:on-exceed="uploadFileExceed"
			>
				<template #trigger>
					<div
						class="w-120 h-120 mb-16 bg-white group hover:bg-primary rounded-full flex items-center justify-center shadow-[1px_2px_80px_4px_rgba(0,0,0,0.07)] cursor-pointer"
					>
						<i
							class="i-iconamoon:cloud-upload-duotone group-hover:text-white text-60 text-primary"
						></i>
					</div>
				</template>
			</el-upload>
		</main>
		<FileUploaderModal
			:api="fileApi"
			:accept="accept"
			:limit="limit"
			v-model="showUploadModal"
			:initial-files="uploadButtonSelectedFiles"
			@on-save="onUploadSuccess"
			@on-complete="onUploadComplete"
		>
			<div class="flex gap-10">
				<div class="font-bold text-20">上传</div>
			</div>
		</FileUploaderModal>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
// Theme toggle
const isDark = ref(false)

const toggleTheme = () => {
	isDark.value = !isDark.value
	if (isDark.value) {
		document.documentElement.classList.add('dark')
		localStorage.setItem('theme', 'dark')
	} else {
		document.documentElement.classList.remove('dark')
		localStorage.setItem('theme', 'light')
	}
}

onMounted(() => {
	// Check for saved theme preference or prefer-color-scheme
	const savedTheme = localStorage.getItem('theme')
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

	if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
		isDark.value = true
		document.documentElement.classList.add('dark')
	}
	getTagsList()
})
function getTagsList() {
	api.getCategoryList().then(res => {
		console.log(res)
	})
}

const uploadButtonSelectedFiles = ref([])
const showUploadModal = ref(false)
const fileApi = reactive({
	request: api.uploadFile,
	data: {

	}
})
const accept = ref('')
const limit = ref(0)
function onSelectResourceFile(file, files) {
	uploadButtonSelectedFiles.value = files
	showUploadModal.value = true
}
function onErrorUpload(error){
	console.log('onErrorUplaod',error)
}
function uploadFileExceed(files, fileList) {
	ElMessage.warning(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}
function onUploadSuccess(resource) {
	console.log(resource)
}

function onUploadComplete(files) {
	if (files.length > 0) {
		console.log(files)
	}
}


</script>

<style>
/* Dark mode setup */
.dark {
	color-scheme: dark;
}

/* Smooth scrolling */
html {
	scroll-behavior: smooth;
}
</style>
