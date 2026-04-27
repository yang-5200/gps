<template>
	<cu-layer v-model="isShow" mode="center" :maskClosable="popObj.isBack" @close="cancel()">
		<view class="modal-pop bg-white">
			<view class="pop-head">
				<view v-if="popObj.title" class="title" :style="popObj.titleStyle">
					{{popObj.title}}
				</view>
			</view>
			<view class="pop-body" >
				<view :style="popObj.contentStyle" v-if="popObj.type == 'alert'" class="type-alert content text-center">
					<scroll-view style="max-height: 900rpx;" scroll-y="true">
						{{popObj.content}}
					</scroll-view>
				</view>
				
			</view>
			<view class="pop-footer">
				<!-- 需要取消按钮 start-->
				<view v-if="popObj.showCancel" class="btns type-1 grid col-2 border-top flex align-center">
					<view class="cancel border-right btn" 
						:style="{
							color:popObj.cancelTextColor
						}"
						@click.stop="cancel()"
					>{{popObj.cancelText}}</view>
					
					<view class="confirm btn" 
						@click.stop="confirm()"
						:style="{
							color:popObj.confirmTextColor
						}"
					>{{popObj.confirmText}}</view>
				</view>
				<!-- 需要取消按钮 end -->
				
				<view v-else class="btns type-2 flex align-center">
					<view class="confirm btn round text-white" 
						@click.stop="confirm()"
					>{{popObj.confirmText}}</view>
				</view>
				
			</view>
		</view>
	</cu-layer>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';
import {DfColor } from '@/common/style/variables.js'

// 响应式数据
const isShow = ref(false);
const popObj = ref({});

// 定义 emits
const emits = defineEmits(['success']);

/**
 * @description 展示组件
 */
function show(data) {
	data.titleStyle = convertStyles(Object.assign({
		textAlign: 'center',
		fontSize: '36rpx',
		fontWeight: 'bold'
	}, data.titleStyle || {}));

	data.contentStyle = convertStyles(Object.assign({
		textAlign: 'center',
		fontSize: '32rpx',
		justifyContent: 'center',
		padding: '32rpx 30rpx'
	}, data.contentStyle || {}));
	
	// console.log('show-data', data);

	popObj.value = Object.assign(popObj.value, {
		type: 'alert',
		isTichText: false,
		data: {},
		title: '',
		isBack: true,
		content: '',
		cancelText: '取消',
		cancelTextColor: '#999999',
		confirmText: '确定',
		confirmTextColor: DfColor,
		...data,
		showCancel: data.showCancel === false ? false : true
	});
	
	isShow.value = true;
}

/**
 * @description 确定
 */
function confirm() {
	if (!isShow.value) return; // 防止重复触发
	hide();
	emits('success', { confirm: true });
}

/**
 * @description 取消
 */
function cancel() {
	if (!isShow.value) return; // 防止重复触发
	hide();
	emits('success', { cancel: true });
}

/**
 * @description 隐藏组件
 */
function hide() {
	isShow.value = false;
}

// 暴露方法给外部使用
defineExpose({
	show
});


onUnmounted(() => {
	//console.log('组件卸载');
})

</script>

<style lang="scss">
	@import './index.scss';
</style>
