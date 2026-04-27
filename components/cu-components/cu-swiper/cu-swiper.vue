<template>
	<view class="cu-swiper">
		<slot></slot>
		<view class="cu-swiper-dots" :style="dotsStyle">
			<view class="dot-number" v-if="dotMode === 'dot-number'" >
				{{current + 1}}/{{len}}
			</view>
			<view class="dot-list" :class="dotMode" v-else>
				<view class="dot-item" v-for="(item,index) in len" :key="index" 
					:style="{
						backgroundColor: current === index ? dotActiveColor : dotColor
					}"
					:class="{
						'active': current === index
					}"
				></view>
			</view>
		</view>
	</view>
</template>

<script setup>
/**
 * 轮播图指示器组件
 * @description 提供多种样式的轮播图指示器
 * @property {String} dotMode - 指示器样式类型
 * @property {String} dotColor - 指示器颜色
 * @property {String} dotActiveColor - 当前指示器颜色
 * @property {Number} len - 轮播图总数量
 * @property {String} dotPos - 指示器位置
 * @property {Number} current - 当前轮播图索引
 */

import { computed , onMounted} from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

// 定义 props
const props = defineProps({
	dotMode: {
		type: String,
		default: 'dot-df' // dot-df：圆点、dot-number：数字、dot-rect：方块、dot-round：块状+点状
	},
	dotColor: {
		type: String,
		default: 'rgba(0, 0, 0, 0.5)'
	},
	dotActiveColor: {
		type: String,
		default: 'rgba(255, 255, 255, 1)'
	},
	len: {
		type: Number,
		default: 0
	},
	dotPos: {
		type: String,
		default: 'bottom-center'
	},
	current: {
		type: Number,
		default: 0
	},
	dotContentOffset: {
		type: Number,
		default: 20
	},
	dotContentOffsetX: {
		type: Number,
		default: 20
	},
	dotContentOffsetY: {
		type: Number,
		default: 20
	}
});

// 计算指示器样式
const dotsStyle = computed(() => {
	const styleObj = {};
	
	switch (props.dotPos) {
		case 'bottom-center':
			styleObj.bottom = props.dotContentOffsetY + 'rpx';
			styleObj.left = '50%';
			styleObj.transform = 'translateX(-50%)';
			break;
		case 'bottom-left':
			styleObj.bottom = props.dotContentOffsetY + 'rpx';
			styleObj.left = props.dotContentOffsetX + 'rpx';
			break;
		case 'bottom-right':
			styleObj.bottom = props.dotContentOffsetY + 'rpx';
			styleObj.right = props.dotContentOffsetX + 'rpx';
			break;
		default:
			break;
	}
	
	return convertStyles(styleObj);
});

const slots = defineSlots();

onMounted(() => {
	//console.log(slots)
})

</script>

<style lang="scss">
	@import './cu-swiper.scss';
</style>