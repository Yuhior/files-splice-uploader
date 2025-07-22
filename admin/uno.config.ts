import presetRemToPx from '@unocss/preset-rem-to-px'
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetUno,
	transformerDirectives,
	transformerVariantGroup
} from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			warn: true,
			prefix: ['i-'],
			extraProperties: {
				display: 'inline-block',
				width: '1em',
				height: '1em'
			},
			collections: {
				me: FileSystemIconLoader('./src/assets/icons/isme'),
				fe: FileSystemIconLoader('./src/assets/icons/feather')
			}
		}),
		presetRemToPx({ baseFontSize: 4 })
	],
	transformers: [transformerVariantGroup(), transformerDirectives()],
	shortcuts: [
		{
			'wh-full': 'w-full h-full',
			// 垂直水平居中
			'flex-center': 'flex items-center justify-center',
			// 放在最后
			'flex-end': 'flex items-center justify-end',
			// 垂直居中
			'flex-middle': 'flex items-center',
			// 分开两边
			'flex-between': 'flex items-center justify-between',
			// 竖着居中
			'flex-col-center': 'flex flex-col justify-center'
		}
	],
	rules: [
		[/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
		['card-shadow', { 'box-shadow': '0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017' }]
	],
	theme: {
		colors: {
			primary: 'var(--primary-color)',
			dark_bg: 'var(--dark-bg)'
		}
	}
})
