import { RouteRecordRaw } from 'vue-router'

const basicRoutes:RouteRecordRaw[] = [
	{
		name: 'Login',
		path: '/login',
		component: () => import('@/views/login/index.vue'),
		meta: {
			title: '登录页',
			layout: 'empty',
		},
	},


	{
		name: '403',
		path: '/403',
		component: () => import('@/views/errorPage/403.vue'),
		meta: {
			title: '没有权限',
			layout: 'empty',
		},
	},
]
/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
	component: () => import('@/views/errorPage/404.vue'),
	meta: {
		hideInBreadcrumb: true,
		hideInMenu: true,
		hideInTab: true,
		title: '404',
	},
	name: 'FallbackNotFound',
	path: '/:path(.*)*',
};

export { basicRoutes, fallbackNotFoundRoute };

