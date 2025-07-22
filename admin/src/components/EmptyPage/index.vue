<script setup lang="ts">
defineOptions({
	name: 'EmptyPage'
})
type Props = {
	title?: string
	description?: string
	minHeight?: string
}
withDefaults(defineProps<Props>(), {
	title: '',
	description: '',
	minHeight: '400px'
})
</script>

<template>
	<div class="m-empty-container" :style="{ minHeight: minHeight }">
		<div class="m-empty-view">
			<img class="logo" src="@/assets/images/ill_empty_list.png" />
			<div class="title">
				{{ title }}
			</div>
			<div class="description">
				{{ description }}
			</div>
			<slot name="descriptionHtml" />
			<slot name="actions" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.m-empty-container {
	width: auto;
	height: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 600px;

	.m-empty-view {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.logo {
			width: 247px;
			height: 151px;
			object-fit: contain;
		}

		.title {
			margin-top: 16px;
			font-size: 16px;
			color: #333333;
		}

		.description {
			margin-top: 16px;
			font-size: 16px;
			color: #999;
		}

		.empty-descript-slot {
			color: #999;
			.empty-text-color {
				font-size: 16px;
				color: var(--primary-color);
			}
		}
	}
}
</style>
