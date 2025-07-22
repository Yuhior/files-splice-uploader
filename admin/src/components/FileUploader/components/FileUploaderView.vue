<script setup lang="ts">
import { FileHelper } from '@/utils'
import {
	FileChuncks,
	type FileHashInfo,
	type FileUploadContext,
	FileStatusEnum,
	ResourceModuleEnum,
	ResourceRulesEnum
} from '../types'
import SparkMD5 from 'spark-md5'
import { checkChuncks, uploadFile } from '@/api/file'
import api from '@/api'

defineOptions({
	name: 'FileUploaderView'
})
type Props = {
	api?: {
		request: Function
		data: Record<string, any> // 或者使用具体的类型替代 any
	}
	accept?: string | null
	initialFiles?: Array<File>
	limit?: number
}
const props = withDefaults(defineProps<Props>(), {
	api: () => ({
		request: () => Promise.resolve(),
		data: {}
	}),
	accept: null,
	initialFiles: () => [] as File[],
	limit: 0
})
// 上传的列表
const failureFiles = ref([])
const successFiles = ref([])
const readyAndProgressFiles = ref([])


const fileUploadContexts = ref<Record<string, FileUploadContext>>({});


const apiData = props.api

const mergedItem = computed(() => {
	return [...failureFiles.value, ...readyAndProgressFiles.value]
})
const acceptFileTypeString = computed(() => {
	if (props.accept) {
		return props.accept
	}
	return FileHelper.flattenAndJoinComma(
		[
			ResourceRulesEnum.IMAGE_FILE_ACCEPTS,
			ResourceRulesEnum.VIDEO_FILE_ACCEPTS,
			ResourceRulesEnum.AUDIO_FILE_ACCEPTS,
			ResourceRulesEnum.DOCUMENT_FILE_ACCEPTS
		].map((item) => {
			return FileHelper.fileTypeLimitVar(item, ResourceModuleEnum.WORK)
		})
	)
})
const isShowUploadButton = computed(() => {
	const readyFile = readyAndProgressFiles.value.find(
		(x) => x.status == FileStatusEnum.READY || x.status == FileStatusEnum.UPLOADING
	)
	return props.api && readyFile && true
})
const isUploading = computed(() => {
	const uploadingFile = readyAndProgressFiles.value.find((x) => x.status == 'uploading')
	return uploadingFile && true
})
const enContinue = computed(() => {
	return Number(props.limit) !== 0 && props.limit <= mergedItem.value.length
})
watch(
	() => props.initialFiles,
	() => {
		addInitialFilesToUploadList()
	}
)
const uploader = ref(null)
onMounted(() => {
	addInitialFilesToUploadList()
})

function addInitialFilesToUploadList() {
	if (uploader.value) {
		props.initialFiles.forEach((file) => {
			uploader.value.handleStart(file.raw)
		})
	}
}

const emit = defineEmits(['on-success', 'on-complete'])

function onChange(file, fileList) {
	readyAndProgressFiles.value = fileList
}

function onRemove(row) {
	// 从上传上下文中移除
	if (fileUploadContexts.value[row.uid]) {
		delete fileUploadContexts.value[row.uid];
	}
	let failFileIndex = failureFiles.value.findIndex((e) => e.uid === row.uid)
	if (failFileIndex >= 0) {
		failureFiles.value.splice(failFileIndex, 1)
	}
	let successFileIndex = successFiles.value.findIndex((e) => e.uid === row.uid)
	if (successFileIndex >= 0) {
		successFiles.value.splice(successFileIndex, 1)
	}
	uploader.value.handleRemove(row)
}

function uploaderOnRemove(file, fileList) {
	readyAndProgressFiles.value = fileList
}

function startUpload() {
	uploader.value.submit()
}

// 上传
const fileSparkMD5 = ref<FileHashInfo[]>([]) // 文件MD5 唯一标识
const fileChuncks = ref<FileChuncks[]>([]) // 文件分片list
const chunckSize = ref(1 * 1024 * 1024) // 分片大小
const isUploadChuncks = ref([]) // 返回 [1,1,1,0,0,1] 格式数组(这里需要服务端返回的值是按照索引正序排列),标识对应下标上传状态 已上传：1 ，未上传：0

async function httpRequsetSubmit({
	file,
	onProgress,
	onSuccess,
	onError
}: {
	file: File
	onProgress: Function
	onSuccess: Function
	onError: Function
	onException?: Function
}) {
	// 获取文件的 uid
	const uid = file.uid;
	// 初始化文件上下文
	const context: FileUploadContext = {
		file,
		uid,
		md5: '',
		chunks: [],
		chunkStatus: [],
		uploadedChunks: 0,
		totalChunks: 0,
		chunkSize: 1 * 1024 * 1024, // 1MB
		isCompleted: false,
		progress: 0
	};
	// 计算文件 MD5
	try {
		context.md5 = await getFileMD5(file);
	} catch (err) {
		onError(err);
		return;
	}
	// 分片文件
	sliceFile(file, context);

	console.log(fileChuncks.value, '分片数据')
	// 检查文件状态
	try {
		const hasUploaded = await checkFile(context);
		console.log(hasUploaded)
		if (hasUploaded) {
			// 计算已上传分片数
			context.uploadedChunks = context.chunkStatus.filter(status => status === 1).length;

			// 如果所有分片都已上传，直接完成
			if (context.uploadedChunks === context.totalChunks) {
				fileUploadContexts.value[uid] = context;
				context.progress = 100;
				return await mergeFile(context)
			}
		}
		// 添加上下文
		fileUploadContexts.value[uid] = context;
		// 开始上传缺失的分片
		await uploadMissingChunks(context, onProgress);
		// 所有分片上传完成后合并文件
		return await mergeFile(context);
	} catch (error) {
		onError(error);
	}
}

async function uploadMissingChunks(context: FileUploadContext, onProgress: Function) {
	const uploadPromises: Promise<void>[] = [];
	for (let i = 0; i < context.totalChunks; i++) {
		if (context.chunkStatus[i] === 0) {
			uploadPromises.push(uploadChunk(context, i, onProgress));
		}
	}
	// 并行上传所有缺失分片
	await Promise.all(uploadPromises);
}

async function uploadChunk(context: FileUploadContext, index: number, onProgress: Function) {
	const chunk = context.chunks[index];

	const data = {
		totalNumber: context.totalChunks,
		chunkSize: context.chunkSize,
		chunckNumber: index,
		md5: context.md5,
		name: context.file.name,
	};
	try {
		await apiData.request(
			new File([chunk.fileChuncks], context.file.name),
			{
				...apiData.data,
				...data,
				onUploadProgress: ({ percent }) => {
					// 修复进度计算逻辑
					const completedChunks = context.uploadedChunks;
					const currentChunkProgress = percent;
					console.log(currentChunkProgress,'currentChunkProgress')
					const totalProgress = (completedChunks + currentChunkProgress) / context.totalChunks * 100;
					console.log(totalProgress,'totalProgress')
					context.progress = Math.min(100, Math.round(totalProgress));
					// // 调用 Element Plus 的进度回调
					onProgress({ percent: context.progress });
				}
			}
		);

		// 标记分片为已上传
		context.chunkStatus[index] = 1;
		context.uploadedChunks++;
		// 更新进度到100% (确保分片完成后进度准确)
		context.progress = Math.round(context.uploadedChunks / context.totalChunks * 100);
		onProgress({ percent: context.progress });
	} catch (err) {
		throw new Error(`分片 ${index + 1}/${context.totalChunks} 上传失败: ${err.message}`);
	}
}

function sizeformatter(row) {
	return FileHelper.formatSizeUnits(row.size / 1000)
}

function statusFormatter(row) {
	const status = row.status
	const responseResult = row.response ? row.response.result : 200
	// 状态和响应结果映射表
	const statusMessages = {
		[FileStatusEnum.READY]: '等待上传',
		[FileStatusEnum.UPLOADING]: '上传中',
		[FileStatusEnum.SUCCESS]: responseResult === 200 ? '上传成功' : null,
		[FileStatusEnum.FAIL]:
			responseResult === 100 || status === 'fail' ? '上传失败' : row.response?.message
	}
	// 返回对应状态的消息
	return statusMessages[status] || statusMessages.success || statusMessages.fail
}

function onClear() {
	uploader.value.clearFiles()
	readyAndProgressFiles.value = []
	successFiles.value = []
	failureFiles.value = []
}

function progressFilter(row) {
	if (row.status == FileStatusEnum.FAIL) return 0
	return row.percentage
}

function uploadFileOnSuccess(response, file, fileList) {
	console.log(response, '999999')
	successFiles.value.push(response.data)
	emit('on-success', file)
}

function uploadFileOnError(err, file, fileList) {
	file.status = 'fail'
	failureFiles.value.push(file)
}

function onComplete() {
	emit('on-complete', successFiles.value)
}

function uploadFileExceed(files, fileList) {
	ElMessage.warning(
		`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`
	)
}

defineExpose({
	onClear
})

//获取文件MD5，注意这里谷歌浏览器有最大文件限制当文件大于2G时浏览器无法读取文件
const getFileMD5 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader()
		fileReader.onload = (e) => {
			const fileMd5 = SparkMD5.ArrayBuffer.hash(e.target.result)
			resolve(fileMd5)
		}
		fileReader.onerror = (e) => {
			reject('文件读取失败')
		}
		fileReader.readAsArrayBuffer(file)
	})
}
//文件切片
const sliceFile = (file: File, context: FileUploadContext) => {
	//文件分片之后的集合
	const chunks: FileChuncks[] = []
	let start = 0
	let end
	while (start < file.size) {
		end = Math.min(start + context.chunkSize, file.size)
		//slice 截取文件字节
		chunks.push({ fileChuncks: file.slice(start, end), fileName: file.name, index: chunks.length })
		start = end
	}
	context.chunks = chunks;
	context.totalChunks = chunks.length;
	context.chunkStatus = new Array(chunks.length).fill(0); // 保证初始状态 未上传的是 0  比如切分成 32个 那就是 [0,0,0,......32个]
}

//合并文件
const mergeFile = async (context: FileUploadContext) => {
	const params = {
		totalNumber: context.totalChunks,
		md5: context.md5,
		name: context.file.name
	};
	try {
		const response = await api.merge(params);
		context.isCompleted = true;
		return response;
	} catch (err) {
		throw new Error(`文件合并失败: ${err.message}`);
	}
}
//检测文件是否上传过，
const checkFile = async (context: FileUploadContext): Promise<boolean> => {
	const response = await api.checkChuncks({ md5: context.md5 });
	if (response.data.length === 0) {
		return false;
	}
	const { file_hash: fileHash, chunck_total_number: chunckTotal } = response.data[0]; // 文件的信息，hash值，分片总数，每条分片都是一致的内容
	if (fileHash === context.md5) {
		const allChunckStatusList = new Array(context.totalChunks).fill(0); // 文件所有分片状态list,默认都填充为0（0: 未上传，1：已上传）
		const chunckNumberArr = response.data.map(item => item.chunck_number); // 遍历已上传的分片，获取已上传分片对应的索引 (chunck_number为每个文件分片的索引)
		console.log(allChunckStatusList, 'allChunckStatusList')
		console.log(chunckNumberArr, 'chunckNumberArr')
		chunckNumberArr.forEach((item, index) => {  // 遍历已上传分片的索引，将对应索引赋值为1，代表已上传的分片 （注意这里，服务端返回的值是按照索引正序排列）
			if (item < context.totalChunks) {
				allChunckStatusList[item] = 1;
			}
		});
		context.chunkStatus = allChunckStatusList;
		return true; // 返回是否上传过，为下面的秒传，断点续传做铺垫
	}
	return false;
}
</script>

<template>
	<div class="file-upload-view">
		<div class="upload-status-container">
			<el-table :data="mergedItem" style="width: 100%" max-height="700px">
				<el-table-column prop="name" label="文件名称" width="300" />
				<el-table-column prop="size" label="文件大小" :formatter="sizeformatter" />
				<el-table-column prop="status" label="上传状态" :formatter="statusFormatter" />
				<el-table-column prop="percentage" label="上传进度">
					<template #default="scope">
						<div v-if="fileUploadContexts[scope.row.uid]">
							<el-progress :percentage="fileUploadContexts[scope.row.uid].progress"
								:status="fileUploadContexts[scope.row.uid].isCompleted ? 'success' : ''" />
						</div>
						<span v-else class="text-primary text-15">准备中...</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="100px">
					<template #default="scope">
						<div v-if="scope.row.status != 'success'" class="flex-center cursor-pointer"
							@click="onRemove(scope.row)">
							<i class="i-material-symbols:scan-delete text-20"></i>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="mt-20">
			<el-upload ref="uploader" class="flex-center gap-20" action="" multiple :http-request="httpRequsetSubmit"
				:auto-upload="false" :show-file-list="false" :disabled="isUploading" :on-remove="uploaderOnRemove"
				:accept="acceptFileTypeString" :on-change="onChange" :limit="limit" :on-success="uploadFileOnSuccess"
				:on-error="uploadFileOnError" :on-exceed="uploadFileExceed">
				<template #trigger>
					<el-button class="select-files" :disabled="isUploading || enContinue">
						继续添加
					</el-button>
				</template>
				<el-button v-if="isShowUploadButton" class="bg-primary text-white" :disabled="isUploading"
					@click="startUpload">
					开始上传
				</el-button>
				<el-button v-else class="bg-primary text-white" :disabled="isUploading" @click="onComplete">
					完成
				</el-button>
			</el-upload>
		</div>
	</div>
</template>

<style scoped lang="scss">
:deep(.el-table td.el-table__cell div) {
	font-size: 15px;
}
</style>
