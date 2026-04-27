<template>
	<view class="cu-notice-bar" :style="barStyle">
		<template v-if="widgets.includes('left-box')">
			<!-- 左侧图标插槽 -->
			<view class="left-icon" v-if="$slots.leftIcon">
				<slot name="leftIcon"></slot>
			</view>
			<!-- 默认左侧图标 -->
			<view class="left-icon" v-else-if="showLeftIcon">
				<text class="cuIcon-notificationfill"></text>
			</view>
		</template>
		
		<!-- 滚动内容区域 -->
		<view class="notice-content" :class="[direction]">
			<!-- 水平滚动 -->
			<view v-if="direction === 'horizontal'" 
				class="horizontal-scroll"
				:style="{ transform: `translateX(${translateX}px)` }"
			>
				<view class="scroll-item" 
					v-for="(item, index) in noticeList" 
					:key="index"
					:style="itemStyle"
					@click="handleItemClick(item, index)"
				>
					{{item.text}}
				</view>
			</view>
			
			<!-- 垂直滚动 -->
			<swiper v-else
				class="vertical-scroll"
				:vertical="true"
				:autoplay="true"
				:interval="interval"
				:circular="true"
				:style="swiperStyle"
			>
				<swiper-item v-for="(item, index) in noticeList" :key="index"
					@click="handleItemClick(item, index)"
				>
					<view class="scroll-item" :style="itemStyle">
						<text class="text-hidden">{{item.text}}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<template v-if="widgets.includes('right-box')">
			<!-- 右侧图标插槽 -->
			<view class="right-icon" v-if="$slots.rightIcon">
				<slot name="rightIcon"></slot>
			</view>
			<!-- 默认右侧图标 -->
			<view class="right-icon" v-else-if="showRightIcon" @click="handleClose">
				<text class="cuIcon-right"></text>
			</view>
		</template>
		
	</view>
</template>

<script setup>
/**
 * 滚动通知组件
 * @description 支持水平和垂直方向的滚动通知
 * @property {Array} noticeList - 通知列表数据
 * @property {String} direction - 滚动方向，可选值：horizontal/vertical
 * @property {Number} speed - 滚动速度，单位px/s
 * @property {Number} interval - 滚动间隔时间，单位ms
 * @property {Object} itemStyle - 滚动项样式
 * @property {Object} barStyle - 通知栏样式
 * @property {Boolean} showLeftIcon - 是否显示左侧默认图标
 * @property {Boolean} showRightIcon - 是否显示右侧默认图标
 * @event {Function} click - 点击通知项时触发
 * @event {Function} close - 点击关闭按钮时触发
 * @slot leftIcon - 自定义左侧图标
 * @slot rightIcon - 自定义右侧图标
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

const props = defineProps({
	widgets:{
		type: Array,
		default: () => ['left-box', 'right-box']
	},
	
	// 通知列表
	noticeList: {
		type: Array,
		default: () => []
	},
	// 滚动方向
	direction: {
		type: String,
		default: 'horizontal' // horizontal/vertical
	},
	// 滚动速度(px/s)
	speed: {
		type: Number,
		default: 50
	},
	// 滚动间隔时间(ms)
	interval: {
		type: Number,
		default: 3000
	},
	// 滚动项样式
	itemStyle: {
		type: Object,
		default: () => ({})
	},
	// 通知栏样式
	barStyle: {
		type: Object,
		default: () => ({})
	},
	// 是否显示左侧图标
	showLeftIcon: {
		type: Boolean,
		default: true
	},
	// 是否显示右侧图标
	showRightIcon: {
		type: Boolean,
		default: true
	}
});

const emits = defineEmits(['click', 'close']);

// 水平滚动位移
const translateX = ref(0);
// 动画定时器
let animationTimer = null;

// 通知栏样式
const barStyle = computed(() => {
	return convertStyles({
		background: '#FFFFFF',
		height: '80rpx',
		...props.barStyle
	});
});

// swiper样式
const swiperStyle = computed(() => {
	return convertStyles({
		height: '80rpx',
		...props.barStyle
	});
});

// 滚动项样式
const itemStyle = computed(() => {
	return convertStyles({
		fontSize: '28rpx',
		...props.itemStyle
	});
});

/**
 * 开始水平滚动动画
 */
function startHorizontalScroll() {
	if (props.direction !== 'horizontal') return;
	
	const step = () => {
		translateX.value -= 1;
		// 当滚动到最后一条时重置位置
		if (Math.abs(translateX.value) >= 1000) {
			translateX.value = 0;
		}
		animationTimer = requestAnimationFrame(step);
	};
	
	animationTimer = requestAnimationFrame(step);
}

/**
 * 停止滚动动画
 */
function stopScroll() {
	if (animationTimer) {
		cancelAnimationFrame(animationTimer);
		animationTimer = null;
	}
}

/**
 * 处理通知项点击
 */
function handleItemClick(item, index) {
	emits('click', { item, index });
}

/**
 * 处理关闭按钮点击
 */
function handleClose() {
	emits('close');
}

onMounted(() => {
	startHorizontalScroll();
});

onUnmounted(() => {
	stopScroll();
});
</script>

<style lang="scss">
.cu-notice-bar {
	position: relative;
	display: flex;
	align-items: center;
	padding: 0 16rpx;
	overflow: hidden;
	
	.left-icon, .right-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60rpx;
		height: 100%;
		flex-shrink: 0;
	}
	
	.notice-content {
		flex: 1;
		overflow: hidden;
		height: 100%;
		
		&.horizontal {
			.horizontal-scroll {
				white-space: nowrap;
				transition: transform 0.3s linear;
				
				.scroll-item {
					display: inline-block;
					padding: 0 20rpx;
				}
			}
		}
		
		&.vertical {
			.vertical-scroll {
				height: 100%;
				.scroll-item {
					height: 100%;
					padding: 0 20rpx;
					display: flex;align-items: center;
				}
			}
		}
	}
}
</style> 