import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'
import chroma from 'chroma-js'
import { defaultLayout, defaultPrimaryColor, naiveThemeOverridesRef } from '@/settings'

// 定义状态的类型
interface AppState {
	collapsed: boolean
	isDark: boolean
	layout: string // 根据实际情况修改
	primaryColor: string // 根据实际情况修改
	naiveThemeOverrides: any // 根据实际情况修改类型
}

export const useAppStore = defineStore(
	'app',
	() => {
		const collapsed = ref(true)
		const isDark = useDark()
		const layout = ref(defaultLayout)
		const primaryColor = ref(defaultPrimaryColor)
		const naiveThemeOverrides = ref(naiveThemeOverridesRef)
		const isMobile = ref(false)
		const appVars = ref(null)

		function switchCollapsed() {
			collapsed.value = !collapsed.value
		}

		function setCollapsed(b) {
			collapsed.value = b
		}

		function toggleDark() {
			isDark.value = !isDark.value
			console.log(isDark.value)
		}

		function setLayout(v) {
			layout.value = v
		}

		function setPrimaryColor(color) {
			primaryColor.value = color
		}

		function setIsMobile(is: boolean) {
			isMobile.value = is
		}
		function setAppVars(vars) {
			appVars.value = vars
		}

		function setThemeColor(color = primaryColor.value, isDarkParam = isDark.value) {
			// 使用 chroma 来根据传入的颜色生成深浅变化的颜色
			const scale = isDarkParam
				? chroma.scale([chroma(color).darken(2), chroma(color).darken(0.5)]) // 深色模式
				: chroma.scale([chroma(color).brighten(2), chroma(color).brighten(0.5)]) // 亮色模式

			const colors = scale
				.mode('lab') // 使用 LAB 模式生成更自然的颜色渐变
				.colors(7) // 生成 7 个颜色

			// 设置全局的 CSS 变量
			document.body.style.setProperty('--primary-color', chroma(colors[5]).css())

			// 更新 Naive UI 主题覆盖
			naiveThemeOverrides.value.common = Object.assign(naiveThemeOverrides.value.common || {}, {
				primaryColor: chroma(colors[5]).css(), // 主色
				primaryColorHover: chroma(colors[4]).css(), // 悬停时的颜色
				primaryColorSuppl: chroma(colors[4]).css(), // 补充颜色
				primaryColorPressed: chroma(colors[6]).css() // 按下时的颜色
			})
		}

		return {
			isDark,
			isMobile,
			collapsed,
			layout,
			primaryColor,
			naiveThemeOverrides,
			setLayout,
			setIsMobile,
			appVars,
			setPrimaryColor,
			switchCollapsed,
			setCollapsed,
			toggleDark,
			setThemeColor,
			setAppVars
		}
	},
	{
		persist: {
			key: 'app-sys',
			// storage: sessionStorage, // 使用 sessionStorage 作为存储机制
			pick: ['appVars','collapsed', 'layout', 'primaryColor'],
			debug: true
		}
	}
)
