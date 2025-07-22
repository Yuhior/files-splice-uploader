export enum FileStatusEnum {
	READY = 'ready',
	UPLOADING = 'uploading',
	SUCCESS = 'success',
	FAIL = 'fail'
}

/**
 * 文件上传到资源的模块集合
 */
export enum ResourceModuleEnum {
	WORK = 1, // 作品
	DUBBING = 2, // 作品配音
	MATERIAL = 3, // 素材
	PROMOTION = 4, // 宣传视频
	BKSND = 5, // 背景声音
	POSTER = 6, // 海报
	ENTERVOICE = 7, // 入场声音
	MENU = 8, // 展览菜单
	COVER = 9 //展览封面
}

/**
 * 资源规则合集
 */
export enum ResourceRulesEnum {
	VIDEO_FILE_ACCEPTS = 'VIDEO_FILE_ACCEPTS',
	IMAGE_FILE_ACCEPTS = 'IMAGE_FILE_ACCEPTS',
	DOCUMENT_FILE_ACCEPTS = 'DOCUMENT_FILE_ACCEPTS',
	AUDIO_FILE_ACCEPTS = 'AUDIO_FILE_ACCEPTS'
}

export interface FileHashInfo {
	md5Value: string
	fileKey: string
}

export interface FileChuncks {
	fileChuncks: File
	fileName: string
	index:number
}

// 定义文件上传上下文
export interface FileUploadContext {
  file: File;
  uid: string;
  md5: string;
  chunks: FileChuncks[];
  chunkStatus: number[]; // 分片状态数组
  uploadedChunks: number; // 已上传分片数
  totalChunks: number;
  chunkSize: number;
  isCompleted: boolean;
  progress: number;
}
