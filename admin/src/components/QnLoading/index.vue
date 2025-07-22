<script setup lang="ts">

</script>

<template>
	<div class="">
		<div class="relative loading-box">
			<div
				class="text-center leading-20 w-40 h-40 absolute left-40 top-40 text-primary font-500 transform-translate-x--50% transform-translate-y--50%">
				青柠云展
			</div>
			<div class="qn-loading-loader"></div>
		</div>
		<div class="qn-loading-text-loader mt-10"></div>
	</div>
</template>

<style scoped>
.loading-box {
	height: 80px;
	width: 80px;
	margin: 0 auto;
	.qn-loading-loader {
		width: 80px;
		aspect-ratio: 1;
		border-radius: 50%;
		padding: 3px;
		background: radial-gradient(farthest-side, var(--primary-color) 95%, #0000) 50% 0/12px 12px no-repeat,
		radial-gradient(farthest-side, #0000 calc(100% - 5px), var(--primary-color) calc(100% - 4px)) content-box;
		animation: loadingCircle 2s infinite;
	}
}
@keyframes loadingCircle {
	to {
		transform: rotate(1turn)
	}
}

.qn-loading-text-loader {
	font-weight: bold;
	font-family: monospace;
	display: inline-grid;
	&:before, &:after {
		content: "Loading...";
		color:var(--primary-color);
		font-size: 18px;
		grid-area: 1/1;
		font-family: monospace;
		-webkit-mask: linear-gradient(90deg, var(--primary-color) 50%, #0000 0) 0 50%/2ch 100%;
		animation: loadingText 1s infinite cubic-bezier(0.5, 220, 0.5, -220);
	}
	&:after {
		-webkit-mask-position: 1ch 50%;
		--s: -1;
	}
}


@keyframes loadingText {
	100% {
		transform: translateY(calc(var(--s, 1) * 0.1%));
	}
}



</style>
