import { createPageLoadingGuard } from './page-loading-guard'
import { createPageTitleGuard } from './page-title-guard'
import { createPermissionGuard } from './permission-guard'
export function setupRouterGuards(router) {
	createPageLoadingGuard(router)
	createPageTitleGuard(router)
	createPermissionGuard(router)
}
