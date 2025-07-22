/**
 * @Author: Yuhior
 * @Date: 2024/11/15
 * @LastEditors: author
 * @Description: desc
 */
import { startProgress, stopProgress } from '@/plugins/progress';
export function createPageLoadingGuard(router) {
	router.beforeEach(() => {
		startProgress()
	})

	router.afterEach(() => {
		setTimeout(() => {
			stopProgress()
		}, 200)
	})
}
