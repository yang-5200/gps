<template>
	<image class="cu-img" 
		:class="className"
		:src="filteredImgSrc"
		:mode="mode"
		@error="imgErr"
		@load="imgLoad"
		:style="styles"
	></image>
</template>

<script setup>
	import {ref, reactive, computed, watch} from 'vue';
	
	// 定义props
	const props = defineProps({
			// 图片路径
			src: {
				type: [String],
				default() {
					return '';
				}
			},
			// 图片裁剪类型和image保持一致
			mode: {
				type: [String],
				default() {
					return 'aspectFill';
				}
			},
			// 图片加载失败占位图
			errUrl: {
				type: [String],
				default() {
					return '/static/404_a.png';
				}
			},
			// 扩展类名 用户设置自定义样式
			className:{
				type:String,
				default(){
					return ''
				}
			},
			styles:{
				type: Object,
				default: () => ({})
			}
	})
	
	// 图片是否加载结束
	const isEnd = ref(false);
	// 图片是否加载成功
	const isSuccess = ref(true);
	
	// 处理 image 路径
	const filteredImgSrc = computed(() => {
		// //console.log('isSuccess.value', isSuccess.value);
		// //console.log('isEnd.value', isEnd.value);
		if(!isEnd.value){ // 未加载完成
			return props.src || props.errUrl;
		}else{
			if(!props.src) return props.errUrl;
			return isSuccess.value ? props.src : props.errUrl;
		}
	})
	
	
	/**
	 * @description 图片加载失败
	 */
	function imgErr(){
		isEnd.value = true;
		isSuccess.value = false;
		// //console.log('图片加载失败');
	}
	
	/**
	 * @description 图片加载结束
	 */
	function imgLoad(){
		isEnd.value = true;
		// //console.log('图片加载结束');
	}
	
	// 监听 路径是否更新
	watch(() => props.src , (nVal, oVal) => {
		// //console.log(nVal);
		isEnd.value = false;
		isSuccess.value = true;
	})
	
</script>

<style lang="scss">
	@import './cu-img.scss';
</style>
