export const nonMenusRoutes = [
	{
		name: 'Home',
		path: '/',
		component: () => import('@/views/home/HomeView.vue'),
		meta: {
			title: '首页',
			layout: 'normal',
		},
	}
]
