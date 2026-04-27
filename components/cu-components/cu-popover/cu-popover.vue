<template>
	<view class="cu-popover">
		<!-- 触发元素插槽 -->
		<view class="trigger" @click="handleTriggerClick">
			<slot></slot>
		</view>
		
		<!-- 气泡菜单 -->
		<view v-if="popOps.show" class="popover-content" :class="[popOps.placement]" :style="[contentStyle, {
			opacity: popOps.opacity
		}]">
			<!-- 箭头 -->
			<view class="arrow" :style="arrowStyle"></view>
			
			<view class="popover-cu-body" v-if="$slots['cu-body']" :style="menuBoxStyle">
				<slot name="cu-body"></slot>
			</view>
			
			<!-- 菜单内容 -->
			<view class="menu-list" v-else :style="menuBoxStyle" >
				<view class="menu-item flex align-center" 
					v-for="(item, index) in menuList" 
					:key="index"
					@click="handleMenuClick(item)"
					:style="menuItemBoxStyle"
				>
					<image v-if="item.icon" class="icon margin-right-xs" :src="item.icon" mode="aspectFit"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			
		</view>
		
		<!-- 遮罩层 -->
		<cu-mask :show="popOps.show" :z-index="998" @click="hide" :customStyle="{backgroundColor: 'transparent'}"></cu-mask>
	</view>
</template>

<script setup>
/**
 * 气泡菜单组件
 * @description 支持自动定位的气泡菜单组件
 * @property {Array} menuList - 菜单列表
 * @property {String} placement - 手动指定弹出位置(可选)：top/bottom
 * @property {Object} menuItemStyle - 菜单项样式
 * @event {Function} select - 选择菜单项时触发
 */

import { ref, reactive, nextTick, getCurrentInstance , computed} from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

// 定义 props
const props = defineProps({
	// 菜单列表
	menuList: {
		type: Array,
		default: () => []
	},
	// 手动指定弹出位置
	placement: {
		type: String,
		default: ''
	},
	// 菜单容器样式
	menuStyle: {
		type: Object,
		default: () => ({})
	},
	// 菜单项样式
	menuItemStyle: {
		type: Object,
		default: () => ({})
	}
});

// 定义 emits
const emits = defineEmits(['select']);

// 触发元素ref
const triggerRef = ref(null);

// 弹窗配置
const popOps = reactive({
	show: false,
	placement: props.placement || 'bottom', // 弹出位置
	left: 0,
	top: 0,
	opacity: 0
});

// 内容样式
const contentStyle = ref({
	left: '0px',
	top: '0px',
});

// 箭头样式
const arrowStyle = ref({
	left: '0px'
});

// 添加默认菜单容器样式
const defaultMenuStyle = {
	minWidth: '180rpx',
	background: 'white',
	borderRadius: '8rpx',
	boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)'
};

// 添加默认菜单项样式
const defaultMenuItemStyle = {
	padding: '20rpx 30rpx',
	whiteSpace: 'nowrap'
};

// 计算菜单容器样式
const menuBoxStyle = computed(() => {
	return convertStyles({
		...defaultMenuStyle,
		...props.menuStyle
	});
});

// 计算菜单项样式
const menuItemBoxStyle = computed(() => {
	return convertStyles({
		...defaultMenuItemStyle,
		...props.menuItemStyle
	});
});

//instance
const instance = getCurrentInstance();

/**
 * @description 显示弹窗
 */
async function show() {
	if (popOps.show) return; // 防止重复调用
	popOps.show = true;
	try {
		await nextTick();
		await updatePosition();
		console.log(popOps.show);
		popOps.opacity = 1;
	} catch (error) {
		//TODO handle the exception
		console.log(error);
	}
	
}

/**
 * @description 隐藏弹窗
 */
function hide() {
	if (!popOps.show) return; // 防止重复调用
	popOps.show = false;
}

/**
 * @description 处理触发元素点击
 */
function handleTriggerClick(e) {
	e.stopPropagation(); // 阻止事件冒泡
	if(popOps.show) {
		hide();
	} else {
		show();
	}
}

/**
 * @description 处理菜单点击
 */
function handleMenuClick(item) {
	hide();
	emits('select', item);
}

/**
 * @description 更新位置
 */
function updatePosition() {
	// 获取触发元素位置信息
	const query = uni.createSelectorQuery().in(instance.proxy);
	query.select('.trigger').boundingClientRect();
	query.select('.popover-content').boundingClientRect();
	return new Promise((resolve, reject) => {
		query.exec(([triggerRect, contentRect]) => {
			
			if (!triggerRect || !contentRect) return;
			// 获取页面可视区域信息
			uni.getSystemInfo({
				success: (systemInfo) => {
					console.log('获取触发元素位置信息');
					
					// 计算最佳展示位置
					const windowHeight = systemInfo.windowHeight;
					const spaceBelow = windowHeight - triggerRect.bottom; // 下方空间
					const spaceAbove = triggerRect.top; // 上方空间
					
					// 如果没有指定位置，则自动判断
					if (!props.placement) {
						// 优先选择空间较大的方向
						popOps.placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
					}
					
					// 计算左侧位置，保持居中对齐
					const left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
					// 确保不超出屏幕左右边界
					const safeLeft = Math.max(10, Math.min(left, systemInfo.windowWidth - contentRect.width - 10));
					
					// 计算顶部位置
					const top = popOps.placement === 'bottom' 
						? triggerRect.bottom + 10 
						: triggerRect.top - contentRect.height - 10;
					
					// 更新样式
					contentStyle.value = {
						left: safeLeft + 'px',
						top: top + 'px'
					};
					
					// 更新箭头位置
					const arrowLeft = triggerRect.left + triggerRect.width / 2 - safeLeft - 8;
					arrowStyle.value = {
						left: arrowLeft + 'px'
					};
					
					resolve(arrowStyle.value)
				}
			});
		});
	})
	
}

// 暴露方法
defineExpose({
	show,
	hide
});
</script>

<style lang="scss">
.cu-popover {
	.trigger {
		display: inline-block;
	}
	
	.popover-content {
		position: fixed;
		z-index: 999;
		
		.arrow {
			position: absolute;
			width: 16rpx;
			height: 16rpx;
			background: white;
			transform: rotate(45deg);
		}
		
		// 上方显示时，箭头在底部
		&.top .arrow {
			bottom: -8rpx;
			z-index: 2;
		}
		
		// 下方显示时，箭头在顶部
		&.bottom .arrow {
			top: -8rpx;
			z-index: 2;
		}
		
		.menu-list {
			position: relative;
			z-index: 1;
			
			.menu-item {
				justify-content: center;
				&:active {
					background-color: #f5f5f5;
				}
				
				.icon {
					width: 32rpx;
					height: 32rpx;
				}
			}
		}
	}
}
</style> 