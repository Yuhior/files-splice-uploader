<script setup lang="ts">
defineOptions({
	name: 'CapsulesButtons'
})
const props = defineProps({
	options: {
		type: Array,
		required: true,
		default: () => ['选项1', '选项2']
	},
	modelValue: {
		type: Number,
		required: true,
		default: 0
	},
	buttonWidth: {
		type: Number,
		default: 60
	},
	buttonHeight: {
		type: Number,
		default: 28
	},
	activeTextColor: {
		type: String,
		default: '#333'
	},
	defaultTextColor: {
		type: String,
		default: 'white'
	},
	activeBgColor: {
		type: String,
		default: 'white'
	},
	defaultBgColor: {
		type: String,
		default: 'rgba(0, 0, 0, 0.4)'
	},
	sliderClass: {
		type: String,
		default: ''
	},
	containerClass: {
		type: String,
		default: ''
	}
})
const emit = defineEmits(['update:modelValue'])
const activeIndex = computed({
	get() {
		return props.modelValue
	},
	set(value) {
		emit('update:modelValue', value)
	}
})
</script>

<template>
	<div
		class="capsule-switch  relative flex-center"
		:class="containerClass"
		:style="{
			width: `${options.length * buttonWidth}px`,
			height: `${buttonHeight}px`,
			borderRadius: `${buttonHeight / 2}px`,
			backgroundColor: defaultBgColor,
		}"
	>
		<!-- 按钮项 -->
		<div
			v-for="(option, index) in options"
			:key="index"
			class="flex-center cursor-pointer z-10 text-14"
			:style="{
				width: `${buttonWidth}px`,
				height: `${buttonHeight}px`,
				color: activeIndex === index ? activeTextColor : defaultTextColor
			}"
			@click="activeIndex = index"
		>
			{{ option }}
		</div>

		<!-- 胶囊滑块 -->
		<div
			:style="{
				left: activeIndex * buttonWidth + 'px',
				width: `${buttonWidth}px`,
				height: `${buttonHeight}px`,
				borderRadius: `${buttonHeight / 2}px`,
				background:activeBgColor,
			}"
			class="capsule-slider absolute z-5  transition-[left] duration-400 shadow-[0px_5px_10px_0px_rgba(25,166,131,0.3)]"
			:class="sliderClass"
		></div>
	</div>
</template>

<style scoped></style>
