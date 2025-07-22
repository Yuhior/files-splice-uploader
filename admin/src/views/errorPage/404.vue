<script setup lang="ts">
import illEmptyList from '@/assets/images/ill_empty_list.png'

</script>

<template>
	<div class="wh-full flex-center">
		<el-result title="404" sub-title="404 您访问的页面不存在">
			<template #icon>
				<el-image  :src="illEmptyList" width="100%" />
			</template>
		</el-result>
	</div>
</template>

<style scoped>

</style>
