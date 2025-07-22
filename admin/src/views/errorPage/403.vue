<script setup lang="ts">

import illEmptyList from '@/assets/images/ill_empty_list.png'
</script>

<template>
	<div class="wh-full flex-center">
		<el-result title="403" sub-title="您没有权限访问的页面">
			<template #icon>
				<el-image  :src="illEmptyList" width="100%" />
			</template>
		</el-result>
	</div>
</template>

<style scoped>

</style>
