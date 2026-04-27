<template>
	<cu-layer v-model="isShow" mode="center" :maskClosable="popObj.isBack" @close="cancel()">
		<view class="modal-pop bg-white">
			<view class="pop-head">
				<view v-if="popObj.title" class="title" :style="popObj.titleStyle">
					{{popObj.title}}
				</view>
			</view>
			<view class="pop-body" >
				<view :style="popObj.contentStyle"	class="type-alert content">
					{{popObj.content}}
				</view>
				
				<view class="name-box flex align-center w100 padding-bottom">
					<view class="padding-lr w100">
						<!-- <input v-model="inputValue" class="box-size-h-40 text-center box-size-w-53" maxlength="1" type="text" /> -->
						<textarea v-model="inputValue" class="textarea-box w100 radius-df text-sm padding-sm" placeholder="请输入" placeholder-class="text-gray" type="text" ></textarea>
					</view>
					<view class="firstName">
						{{popObj.data.realName}}
					</view>
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
import {validate} from '@/common/utils/validate.js'
import { toast } from '../../../../common/utils/util';

// 响应式数据
const isShow = ref(false);
const popObj = reactive({});
const inputValue = ref('')

// 定义 emits
const emits = defineEmits(['success']);

/**
 * @description 展示组件
 */
function show(data) {
	data.titleStyle = convertStyles(Object.assign({
		textAlign: 'center',
		fontSize: '32rpx',
		fontWeight: '600'
	}, data.titleStyle || {}));

	data.contentStyle = convertStyles(Object.assign({
		textAlign: 'center',
		fontSize: '28rpx',
		justifyContent: 'flex-start',
		padding: '32rpx 54rpx'
	}, data.contentStyle || {}));

	Object.assign(popObj, {
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
	inputValue.value = '';
	
	isShow.value = true;
}

/**
 * @description 确定
 */
function confirm() {
	if (!isShow.value) return; // 防止重复触发
	if(!validate(inputValue.value, 'null')) return toast('请输入内容')
	hide();
	emits('success', { confirm: true, data: {
		inputValue: inputValue.value,
		...popObj.data
	} });
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
