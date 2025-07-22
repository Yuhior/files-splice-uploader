import { createApp } from 'vue'
import Loading from './index.vue'

function createLoading(el) {
	// 创建div标签
	const loadingDom = document.createElement('div')
	// 添加自定义属性作为标识，避免重复loading
	loadingDom.setAttribute('data-v', 'loading')
	// 设置样式，父元素相对定位，子元素绝对定位父元素之上
	el.style.position = 'relative'
	loadingDom.style.width = `${el.offsetWidth}px`
	loadingDom.style.height = `${el.offsetHeight}px`
	loadingDom.style.maxHeight = '100vh'
	loadingDom.style.position = `absolute`
	loadingDom.style.background = `#fff`
	loadingDom.style.display = `flex`
	loadingDom.style.justifyContent = `center`
	loadingDom.style.alignItems = `center`
	loadingDom.style.top = '0'


	loadingDom.style.borderRadius = 'inherit'
	// 创建APP实例，传入loading组件，并且挂载loading组件和创建的标签
	const app = createApp(Loading)
	const instance = app.mount(loadingDom)
	loadingDom.appendChild(instance.$el)
	el.appendChild(loadingDom)
}

export default createLoading
