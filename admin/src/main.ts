import 'virtual:uno.css'
import '@/styles/base.scss'

import { createApp } from 'vue'
import { setupStore } from '@/stores'
import { setupRouter } from './router'
import { setupDirectives } from './directives'
import App from './App.vue'
import eventHub from '@/utils/eventBus'

const app = createApp(App)
app.config.globalProperties.eventHub = eventHub

// 挂载自定义指令
setupDirectives(app)
await setupRouter(app)
setupStore(app)
app.mount('#app')


interface Module {
	[key: string]: any;
}

const utilsContext: Record<string, Module> = import.meta.glob('@/plugins/krpano/*.{js,ts}', { eager: true })

// krpano 需要的函数列表
import requiredFunctions from './xmlUseFun.json'

Object.keys(utilsContext).forEach((fileName) => {
	const utilsModule = utilsContext[fileName]
	Object.keys(utilsModule).forEach((exportedFunction) => {
		if (requiredFunctions.includes(exportedFunction)) {
			(window as any)[exportedFunction] = utilsModule[exportedFunction]
		}
	})
})


