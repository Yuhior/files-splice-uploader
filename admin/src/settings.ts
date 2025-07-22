import { fileQuantityLimit } from '@/utils'

export const defaultLayout = 'normal'

export const defaultPrimaryColor = '#3E74FA'

// 控制 LayoutSetting 组件是否可见
export const layoutSettingVisible = false

export const APP_MODULE = {
	OSS_ON: 0,
	ONLINE_PLATFORM: 1
}
// 展览模块Id
export const vrModuleId = 1
// 展览上次单次最多传多少
export const uploadOnceQuantityLimit = 10

export const panoAppParams = {
	z3dpano_version: '7',
	mmi_pos: '',
	webvr: 0,
	positionPlanScale: 0.4,
	HSV3_TEXT_MAX_CHAR: 330
}
export const naiveThemeOverridesRef = {
	common: {
		primaryColor: '#316C72FF',
		primaryColorHover: '#316C72E3',
		primaryColorPressed: '#2B4C59FF',
		primaryColorSuppl: '#316C72E3'
	}
}

export const basePermissions = []

export const soundMuteExpireTime = 24 * 60 * 60 * 1000 // 24 小时
