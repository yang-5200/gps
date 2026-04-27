<template>
	<view class="pop-page">
		<cu-popup-group ref="cuPopupGroupRef" :mode="mode" @success="handlePopupSuccess"></cu-popup-group>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { onLoad, onReady, onBackPress } from '@dcloudio/uni-app';

// 响应式数据
const mode = ref('');
const popData = ref(null);
const cuPopupGroupRef = ref(null);

// 生命周期
onLoad(() => {
	// console.log('加载弹窗');
	
	// 获取弹窗配置
	mode.value = uni.popInfo?.mode || 'modal';
	popData.value = uni.popInfo?.data;
	
	// 设置返回手势
	const page = getCurrentPages().pop().$getAppWebview();
	page.setStyle({
		'popGesture': !popData.value?.isBack ? 'none' : 'close'
	});
});

onReady(() => {
	// 显示弹窗
	cuPopupGroupRef.value?.show(popData.value);
});

onUnmounted(() => {
	// 清理事件
	uni.$off('OnPopSuccess');
});

/**
 * @description 处理弹窗回调
 */
function handlePopupSuccess(result) {
	console.log('处理弹窗回调',result);
	if (!result) return;
	
	setTimeout(() => {
		// 执行回调
		uni.popInfo?.success?.(result);
	}, 100)
	
	// 返回上一页
	uni.navigateBack();
}

/**
 * @description 处理返回按键
 */
onBackPress(({ from }) => {
	// 禁止返回时拦截物理返回键
	if (!popData.value?.isBack && from === 'backbutton') {
		return true;
	}
});
</script>

<style lang="scss">
@import './index.scss';

// 设置透明背景
page {
	background-color: transparent;
}
</style>
