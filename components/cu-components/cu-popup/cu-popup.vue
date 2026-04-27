<template>
	<view class="cu-popup">
		<!-- #ifndef APP-NVUE -->
		<cu-popup-group ref="cuPopupGroupRef" :mode="mode" @success="handlePopupSuccess"></cu-popup-group>
		<!-- #endif -->
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { back, toPath } from '@/common/utils/util.js';

// 定义 props
const props = defineProps({
	// 弹窗类型
	mode: {
		type: String,
		default: ''
	},
	// 是否为tabbar页面
	isTabbarPage: {
		type: Boolean,
		default: false
	}
});

// 组件引用
const cuPopupGroupRef = ref(null);

// 当前弹窗实例
let currentPopup = null;

/**
 * @description 处理弹窗回调
 */
function handlePopupSuccess(result) {
	if (!result) return;
	
	// #ifdef H5 || MP-WEIXIN
	if (props.isTabbarPage) {
		uni.showTabBar();
	}
	// #endif
	
	// #ifdef APP-PLUS
	back();
	// #endif
	
	// 执行回调
	currentPopup?.success?.(result);
}

/**
 * @description 展示弹出层
 * @param {Object} options - 配置项
 * @param {Boolean} [options.isBack=true] - 是否可以返回关闭
 * @param {Function} [options.success] - 成功回调
 */
function show(options = {}) {
	const popupOptions = {
		isBack: true,
		...options
	};

	// 初始化弹窗
	currentPopup = createPopup(popupOptions);
}

/**
 * @description 创建弹出层
 * @private
 */
function createPopup(options) {
	const { success = () => {} } = options;
	
	// 存储弹窗信息
	uni.popInfo = {
		mode: props.mode,
		data: options,
		success
	};
	
	// #ifdef APP-PLUS
	toPath('/pages/pop/index');
	// #endif

	// #ifdef H5 || MP-WEIXIN
	if (props.isTabbarPage) {
		uni.hideTabBar();
	}
	cuPopupGroupRef.value?.show();
	// #endif
	
	return {
		...uni.popInfo
	};
}

// 暴露方法给外部使用
defineExpose({
	show
});
</script>

<style lang="scss">
.cu-popup {
	/* 弹窗容器样式 */
}
</style>
