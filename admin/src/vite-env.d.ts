/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TITLE:string,
	readonly VITE_USE_HASH: string;
	readonly VITE_PUBLIC_PATH: string;
	readonly VITE_AXIOS_BASE_URL: string;
	readonly VITE_PROXY_TARGET:string,
	readonly VITE_PROXY_TARGET:string,
	readonly VITE_OSS_PUBLIC_PATH:string,
	// 其他环境变量
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
