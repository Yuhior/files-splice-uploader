<template>
	<div class="wh-full">
		<el-config-provider  :locale="zhCn" >
			<router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
				<component :is="Layout" :key="curRoute.fullPath">
					<KeepAlive>
						<component :is="Component" :key="curRoute.fullPath" />
					</KeepAlive>
				</component>
				<!--			<LayoutSetting v-if="layoutSettingVisible" class="fixed right-12 top-1/2 z-999" />-->
			</router-view>
		</el-config-provider>
	</div>
</template>

<script setup lang="ts">
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { useAppStore, useAuthStore, useRouterStore } from "@/stores";
import { layoutSettingVisible } from "./settings";
import { getActivePinia } from "pinia";
import { isMobile } from "@/utils";

const layouts = new Map();

function getLayout(name) {
	console.log(name);
	// 利用map将加载过的layout缓存起来，防止重新加载layout导致页面闪烁
	if (layouts.get(name)) return layouts.get(name);
	const layout = markRaw(
		defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`))
	);
	layouts.set(name, layout);
	return layout;
}

const route = useRoute();
const appStore = useAppStore();
if (appStore.layout === "default") appStore.setLayout("");
const Layout = computed(() => {
	if (!route.matched?.length) return null;
	return getLayout(route.meta?.layout || appStore.layout);
});
appStore.setIsMobile(isMobile());
</script>

<style scoped></style>
