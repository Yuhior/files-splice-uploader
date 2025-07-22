/**
 * @Author: Yuhior
 * @Date: 2024/11/15
 * @LastEditors: author
 * @Description: desc
 */
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import type { App } from 'vue'

export function setupStore(app: App<Element>): void {
	const pinia = createPinia()
	pinia.use(({ store }) => {
		const initialState = JSON.parse(JSON.stringify(store.$state,(key, value)=>{
			if (key === 'router' || key === 'route') { // 排除route和router
				return undefined
			}
			return value
		}))
		store.$reset = () => {
			store.$patch(initialState)
		}
	})
	pinia.use(piniaPluginPersistedstate)
	app.use(pinia)
}

export * from './modules'
