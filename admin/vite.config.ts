import path from 'node:path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
	const viteEnv = loadEnv(mode, process.cwd())
	const { VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = viteEnv
	return {
		base: VITE_PUBLIC_PATH || '/',
		plugins: [
			vue(),
			Unocss(),
			AutoImport({
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.vue$/,
					/\.vue\?vue/ // .vue
				],
				imports: [
					// presets
					'vue',
					'vue-router',
					'pinia',
					'@vueuse/core'
				],
				dts: 'types/auto-imports.d.ts',
				resolvers: [ElementPlusResolver({
					importStyle: 'sass'
				})]
			}),
			Components({
				resolvers: [ElementPlusResolver({
					importStyle: 'sass'
				})]
			}),
			vueJsx(),
			vueDevTools()
		],
		resolve: {
			alias: {
				'@': path.resolve(process.cwd(), 'src'),
				'~': path.resolve(process.cwd())
			}
		},
		optimizeDeps: {
			include: ['lodash']
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: `@use "@/styles/index.scss" as *;`,
					api: 'modern',
				}
			}
		},
		build: {
			// 设置最终构建的浏览器兼容目标
			target: 'esnext',
			minify: 'esbuild',
			// 构建后是否生成 source map 文件(用于线上报错代码报错映射对应代码)
			sourcemap: false,
			cssTarget: 'chrome80',
			// 指定输出路径（相对于 项目根目录)
			outDir: 'dist',
			// 只有 minify 为 terser 的时候, 本配置项才能起作用
			// terserOptions: {
			//   compress: {
			//     // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
			//     keep_infinity: true,
			//     // 打包是否自动删除 console
			//     drop_console: VITE_DROP_CONSOLE,
			//   },
			// },
			// 启用/禁用 gzip 压缩大小报告
			// 压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能
			reportCompressedSize: true,
			// chunk 大小警告的限制（以 kbs 为单位）
			chunkSizeWarningLimit: 2000,
			// 自定义底层的 Rollup 打包配置
			rollupOptions: {
				// 静态资源分类打包
				output: {
					chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
					entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
					assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
					// 将 node_modules 三方依赖包最小化拆分
					manualChunks(id) {
						if (id.includes('node_modules')) {
							const paths = id.toString().split('node_modules/')
							if (paths[2]) {
								return paths[2].split('/')[0].toString()
							}

							return paths[1].split('/')[0].toString()
						}
					}
				}
			}
		},
		server: {
			proxy: {
				'/api': {
					ws:true,
					target: VITE_PROXY_TARGET,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, '')
				}
			}
		}
	}

})
