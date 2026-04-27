<template>
	<view class="cu-mask" hover-stop-propagation 
		:style="[maskStyle]" 
		@click.stop="handelMaskClick" 
		@touchmove.stop.prevent 
		:class="{
			'cu-mask-zoom': zoom,
			'cu-mask-show': show
		}">
	  <slot />
	</view>
</template>

<script setup>
/**
 * mask 遮罩
 * @description 创建一个遮罩层，用于强调特定的页面元素，并阻止用户对遮罩下层的内容进行操作，一般用于弹窗场景
 */

import { ref, reactive, watch, computed} from "vue";
import {convertStyles} from '@/common/utils/styleHandleUtil.js'

// 定义props
const props = defineProps({
	// 是否显示遮罩
	show: {
		type: Boolean,
		default: false
	},

	// 层级z-index
	zIndex: {
		type: [Number, String],
		default: ''
	},

	// 用户自定义样式
	customStyle: {
		type: Object,
		default () {
			return {}
		}
	},

	// 遮罩的动画样式， 是否使用使用zoom进行scale进行缩放
	zoom: {
		type: Boolean,
		default: true
	},

	// 遮罩的过渡时间，单位为ms
	duration: {
		type: [Number, String],
		default: 300
	},

	// 是否可以通过点击遮罩进行关闭
	maskClickAble: {
		type: Boolean,
		default: true
	}
})

// 定义$event
const $event = defineEmits();

// 蒙版样式
const maskStyle = computed(() => {
	let style = [
		`background:rgba(0, 0, 0, 0.4);`,
		`transition:all ${ props.duration / 1000 }s ease-in-out;`,
		`transform:${ props.show && props.zoom ? 'scale(1, 1)' :'scale(1.2, 1.2)' };`
	];
	
	if(props.show) {
		style.push(`z-index:${props.zIndex ? props.zIndex : 101};`)
	}else{
		style.push(`display: none;`)
	}
	
	// 处理自定义样式
	const customStyle = convertStyles(props.customStyle);
	if(customStyle){
		style.push(customStyle)
	}
	return style.join('');
})

/**
 * @description 处理点击
 * @param {Object} e
 */
function handelMaskClick(e){
	console.log('处理点击', props.maskClickAble);
	if(!props.maskClickAble) return;
	$event('maskClick');
}


</script>

<style lang="scss">
	@import './cu-mask.scss';
</style>