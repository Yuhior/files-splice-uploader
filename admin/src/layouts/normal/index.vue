<template>
	<div class="wh-full flex">
		<aside
			class="flex-col flex-shrink-0 transition-width-300"
			:class="appStore.collapsed ? 'w-0' : 'w-220'"
		>
			<SideBar/>
		</aside>
		<article class="w-0 flex-col flex-1">
			<slot/>
		</article>
	</div>
</template>

<script setup lang="ts">

import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>

<style scoped>

</style>
