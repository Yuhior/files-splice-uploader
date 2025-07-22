<script setup lang="ts">
const fileModalValue = defineModel()
type Props = {
	api?: Object<{ request: Function; data: Object }>
	accept?: string | null
	initialFiles?: Array<File>
	limit?: number
}
withDefaults(defineProps<Props>(), {
	api: () => {},
	accept: null,
	initialFiles: [] as File[],
	limit: 0,
})
const emit = defineEmits(['on-save', 'on-complete','update:modelValue'])

const uploadView = ref(null)

function handleClose() {
	uploadView.value.onClear()
	fileModalValue.value = false
	emit('update:modelValue', false);
}

function onUploadSuccess(file) {
	emit('on-save', file)
}

function onUploadComplete(files) {
	emit('on-complete', files)
	handleClose()
}
</script>

<template>
	<div class="file-uploader-modal">
		<el-dialog v-model="fileModalValue" :before-close="handleClose"  width="1000px">
			<template #header="{ close, titleId, titleClass }" >
				<slot>上传</slot>
			</template>
			<FileUploaderView
				ref="uploadView"
				:api="api"
				:accept="accept"
				:initial-files="initialFiles"
				:limit="limit"
				@on-success="onUploadSuccess"
				@on-complete="onUploadComplete"
			/>
		</el-dialog>
	</div>
</template>

<style scoped>
</style>
