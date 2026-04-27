<template>
	<view class="cu-layer" :class="{ show: modelValue }" :style="layerStyle" v-if="isVisible">
		<cu-mask :show="layerOps.showDrawer" :z-index="maskZIndex" @maskClick="handleMaskClick"></cu-mask>
		<view class="layer-body" 
			:id="layerId" 
			:style="handleBodyStyle"
			:class="[
				'mode-' + mode,
				{
					'show': layerOps.showDrawer,
					'close': !layerOps.showDrawer
				}
			]"
			@touchmove.stop.prevent 
		>
			<slot/>
		</view>
	</view>
</template>

<script setup>
	/**
	 * popup 弹窗
	 * @description 弹出层容器，用于展示弹窗、信息提示等内容，支持上、下、左、右和中部弹出。组件只提供容器，内部内容由用户自定义
	 */
	
	import { ref, reactive, computed, watch, getCurrentInstance, nextTick } from 'vue'
	import { convertStyles } from '@/common/utils/styleHandleUtil.js'
	import { nanoid } from 'nanoid/non-secure'
	
	// 定义props
	const props = defineProps({
		// v-model 的值
		modelValue: {
			type: Boolean,
			default: false
		},		// 弹出方向 	left|right|top|bottom|center 
		mode: {
			type: String,
			default: 'left'
		},
		// 层级
		cuZindex:{
			type: Number,
			default: 102
		},
		// 弹窗内容样式
		cuBodyStyle:{
			type: Object,
			default(){
				return {}
			}
		},
		// 弹框内容的圆角值
		borderRadius:{
			type: String,
			default: '10rpx'
		},
		// 运动轨迹 值为 'all ease .2s'
		transition: {
		  type: String,
		  default: 'all 0.2s ease'
		},
		// 内容背景
		bodyBg:{
			type: String,
			default: 'white'
		},
		// 动画时长(ms)
		duration: {
			type: Number,
			default: 300
		},
		// 是否允许点击遮罩关闭
		maskClosable: {
			type: Boolean,
			default: true
		}
	})

	// 定义事件触发器
	const emit = defineEmits(['update:modelValue', 'open', 'close'])
	
	
	//instance
	const instance = getCurrentInstance();
	
	// 组件唯一ID
	const layerId = `layer-${nanoid()}`;
	
	// 控制整个组件显示
	const isVisible = ref(false);
	
	// 遮罩层z-index
	const maskZIndex = computed(() => props.cuZindex - 1);
	
	// 弹层整体样式
	const layerStyle = computed(() => {
		return convertStyles({
			zIndex: props.cuZindex - 2
		});
	});
	
	// cu-layer 样式
	const handleBodyStyle = computed(() => {
		const style = {
			background: props.bodyBg,
			zIndex: props.cuZindex,
			transition: `all ${props.duration}ms ease-in-out`
		};
		switch (props.mode){
			case 'left':
				style.borderRadius = `0 ${props.borderRadius} ${props.borderRadius} 0`;
				break;
			case 'right':
				style.borderRadius = ` ${props.borderRadius} 0 0 ${props.borderRadius}`;
				break;
			case 'top':
				style.borderRadius = `0 0 ${props.borderRadius} ${props.borderRadius}`;
				break;
			case 'bottom':
				style.borderRadius = `${props.borderRadius} ${props.borderRadius} 0 0`;
				break;
			case 'center':
				style.borderRadius = props.borderRadius;
				style.left = '50%';
				style.top = '50%';
				style.transform = 'translate(-50%, -50%) scale(1)';
				break;
		}
		return convertStyles({...style, ...props.cuBodyStyle})
	})
	
	// showDrawer
	const layerOps = reactive({
		showDrawer: false,
		timer: null,
		visibleSync: false
	})
	
	// body 样式信息
	const boydStyleInfo = reactive({
		width: 0,
		height: 0
	})
	
	watch(() => props.modelValue, async (newVal) => {
		// //console.log(newVal, 'props.modelValue');
		if(newVal === layerOps.showDrawer) return;
		if(newVal) {
			await open();
		} else {
			await close();
		}
	}, { immediate: true })
	
	/**
	 * @description 处理遮罩点击
	 */
	function handleMaskClick() {
		console.log('处理遮罩点击');
		if (props.maskClosable) {
			close();
		}
	}
	
	/**
	 * @description 打开弹框
	 */
	async function open(){
		isVisible.value = true;
		layerOps.showDrawer = true;
		emit('open');
		
		await nextTick();
		queryBodyElInfo();
	}
	
	/**
	 * @description 关闭弹框
	 */
	async function close(){
		layerOps.showDrawer = false;
		clearTimeout(layerOps.timer);
		layerOps.timer = setTimeout(() => {
			isVisible.value = false;
			emit('close');
			emit('update:modelValue', false);
		}, props.duration);
	}
	
	/**
	 * @description 获取节点信息
	 */
	function queryBodyElInfo(){
		const views = uni
			.createSelectorQuery()
			.in(instance.proxy)
			.select(`#${layerId}`);
		views.fields(
			{ size: true },
			res => {
				// //console.log(res);
				if(!res) return;
				// boydStyleInfo = res;
				boydStyleInfo.height = res.height;
				boydStyleInfo.width = res.width;
			}
		).exec();
	}
	
	// 暴露方法给外部使用
	defineExpose({
		close
	});
</script>

<style lang="scss">
	@import './cu-layer.scss';
</style>