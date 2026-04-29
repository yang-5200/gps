<template>
	<view class="page-wrap pg-df-color">
		<!-- 顶部导航栏 -->

		<cu-nav-bar  title-text="关于我们" :background="navbarImmerse.navBar.backgroundColor"></cu-nav-bar>
		<view class="page-content padding ">
			
			<view class="bg-white padding-sm">
				123444ysysshb集到
			</view>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';

const { navbarImmerse } = useNavbarImmerse();

onLoad((options) => {
	console.log('关于我们页面加载', options);
});
</script>

<style lang="scss">

.page-wrap {
	.page-content {
	}
}
</style>
