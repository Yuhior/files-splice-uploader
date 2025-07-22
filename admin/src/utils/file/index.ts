import { useAppStore } from '@/stores'
import { uploadOnceQuantityLimit } from '@/settings'
import api from '@/api'

enum extentionToAcceptMap {
	jpg = 'image/jpeg',
	png = 'image/png',
	jpeg = 'image/jpeg',
	gif = 'image/gif',
	mp4 = 'video/mp4',
	mp3 = 'audio/mp3',
	amr = 'audio/amr',
	m4a = 'audio/m4a',
	wav = 'audio/wav',
	wma = 'audio/wma',
	pdf = '.pdf',
	doc = '.doc',
	docx = '.docx',
	ppt = '.ppt',
	pptx = '.pptx',
	xls = '.xls',
	xlsx = '.xlsx'
}



export class FileHelper {
	private static _appStore: ReturnType<typeof useAppStore> | null = null

	private static get appStore() {
		if (!this._appStore) {
			this._appStore = useAppStore()
		}
		return this._appStore
	}

	/**
	 * 文件格式处理
	 * @param type 接受的文件格式类型name
	 * @param purpose 资源所属模块
	 */
	static fileTypeLimitVar(type: string, purpose: number): any {
		const appVars = this.appStore.appVars
		if (appVars && appVars.length) {
			const index = appVars.findIndex((c) => c.name === type && purpose === c.purpose)
			if (index !== -1) return appVars[index].value.map(suffix => extentionToAcceptMap[suffix])
			return null
		}
		return null
	}
	/**
	 * 二维数组转成一维数组 以,分隔
	 * @param arr
	 */
	static flattenAndJoinComma(arr: [][]) {
		return arr.reduce((acc, curr) => acc.concat(curr), []).join(',')
	}
	/**
	 * 文件大小限制
	 * @param type
	 */
	static fileSizeLimitVar(type): void {
		const appVars = this.appStore.appVars
		if (appVars && appVars[type]) {
			if (
				type == 'IMAGE_SIZE_LIMIT' ||
				type == 'VIDEO_SIZE_LIMIT' ||
				type == 'DOCUMENT_SIZE_LIMIT' ||
				type == 'AUDIO_SIZE_LIMIT'
			) {
				return appVars[type]
			}
		}
		return null
	}
	/**
	 * 文件大小显示
	 * @param { number } size 文件大小
	 */
	static formatSizeUnits(size = 0) {
		const units = ['KB', 'MB', 'GB', 'TB', 'PB']
		let unitIndex = 0

		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024
			unitIndex++
		}
		return `${size.toFixed(2)} ${units[unitIndex]}`
	}
	/**
	 * base64 转图片
	 * @param dataUrl
	 * @param filename
	 */
	static dataURLtoFile(dataUrl: string, filename: string) {
		const arr = dataUrl.split(',')
		const mime = arr[0].match(/:(.*?);/)[1]
		const bstr = atob(arr[1])
		let len = bstr.length
		const u8arr = new Uint8Array(len)
		while (len--) {
			u8arr[len] = bstr.charCodeAt(len)
		}
		return new File([u8arr], filename, { type: mime })
	}

	static isExceedLimit(currentCount, limit) {
		return currentCount >= limit;
	}

	static fileQuantityLimit(remainingResources = 100) {
		return Math.min(remainingResources, uploadOnceQuantityLimit)
	}

}










