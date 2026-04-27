<script setup>
	import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
	
	onLaunch(() => {
		console.log('App Launch')
	})
	
	onShow(() => {
		console.log('App Show')
	})
	
	onHide(() => {
		console.log('App Hide')
	})
</script>

<style lang="scss">
	/*每个页面公共css */
	/* #ifndef APP-NVUE */
	@import "uview-plus/index.scss";
	@import '/common/style/public.scss';
	@import '/common/style/base.scss';
	@import '/common/style/icon.css';
	/* #endif */
</style>