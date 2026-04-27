<template>
	<view class="cu-page-footer">
		<!-- 占位元素 -->
		<view v-if="isFixed && placeholder" class="footer-placeholder" :style="placeholderStyle"></view>
		
		<!-- 页脚内容 -->
		<view class="footer-content" 
			:class="[isFixed ? 'fixed' : '', safeAreaInsetBottom ? 'safe-area' : '']" 
			:id="footerId"
			:style="footerStyle"
		>
			<slot></slot>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue';
	
	const instance = getCurrentInstance();
	
	const props = defineProps({
		// 是否固定在底部
		isFixed: {
			type: Boolean,
			default: false
		},
		// 固定时是否占位
		placeholder: {
			type: Boolean,
			default: true
		},
		// 是否适配底部安全区
		safeAreaInsetBottom: {
			type: Boolean,
			default: true
		},
		// 背景色
		background: {
			type: String,
			default: '#FFFFFF'
		}
	});
	
	// 内容高度
	const contentHeight = ref(0);
	
	// 占位元素样式
	const placeholderStyle = computed(() => {
		return {
			height: contentHeight.value + 'px'
		}
	});
	
	// 页脚样式
	const footerStyle = computed(() => {
		return {
			background: props.background
		}
	});
	
	// 生成唯一ID
	const footerId = 'footer_' + Math.random().toString(36).substr(2, 9);
	
	// 定时器ID
	let observerTimer = null;
	
	// 获取内容高度
	function updateContentHeight() {
		const query = uni.createSelectorQuery().in(instance);
		query.select(`#${footerId}`).boundingClientRect(data => {
			if (data) {
				// //console.log(data);
				contentHeight.value = data.height;
			}
		}).exec();
	}
	
	// 开始监听高度变化
	function startObserver() {
		if (props.isFixed && props.placeholder) {
			let count = 0;
			// 初始获取一次高度
			updateContentHeight();
			// 定时检查高度变化
			observerTimer = setInterval(() => {
				updateContentHeight();
				count ++;
				if(count >= 3){
					stopObserver();
				}
			}, 100);
		}
	}
	
	// 停止监听
	function stopObserver() {
		if (observerTimer) {
			clearInterval(observerTimer);
			observerTimer = null;
		}
	}
	
	onMounted(() => {
		startObserver();
	});
	
	onUnmounted(() => {
		stopObserver();
	});
</script>

<style lang="scss">
.cu-page-footer {
	.footer-content {
		width: 100%;
		
		&.fixed {
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 98;
		}
		
		&.safe-area {
			padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
			padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
		}
	}
}
</style> 