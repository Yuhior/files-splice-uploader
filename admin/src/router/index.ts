
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'
import { basicRoutes, fallbackNotFoundRoute } from './basicRoutes'
import { nonMenusRoutes } from './nonMenusRoutes'

/** 路由列表，由基本路由+静态路由组成 */
export const coreRoutes: RouteRecordRaw[] = [
	...basicRoutes,
	fallbackNotFoundRoute,
];

export const router = createRouter({
	history:
		import.meta.env.VITE_USE_HASH === 'true'
			? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH || '/')
			: createWebHistory(import.meta.env.VITE_PUBLIC_PATH || '/'),
	routes: [...coreRoutes, ...nonMenusRoutes],
	scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app) {
	app.use(router)
	setupRouterGuards(router)
}
