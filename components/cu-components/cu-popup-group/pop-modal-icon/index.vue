<template>
	<cu-layer v-model="layerOps.show" mode="center" :maskClosable="false" :duration="200">
		<view class="pop-modal-icon" :style="handleWrapStyle">
			<!-- 内容区域 start -->
			<view class="content-box" :style="handleContentBoxStyle">
				<view class="title text-center text-lg text-bold" v-if="popOps.title" :style="handleTitleStyle">
					{{popOps.title}}
				</view>
				
				<!-- icon start -->
				<view class="icon-box flex justify-center" v-if="popOps.showIcon">
					<image class="icon" :src="popOps.icon" mode="aspectFit" :style="handleIconStyle"></image>
				</view>
				<!-- icon end -->
				
				<view class="content text-center margin-top-xs" v-if="popOps.content" :style="handleContentStyle">
					{{popOps.content}}
				</view>
				
				<!-- 输入框 start -->
				<view class="input-box margin-top" v-if="popOps.showInput">
					<input class="input shadow-df text-df text-center padding-sm radius-df" 
						v-model="inputValue"
						:type="popOps.inputType || 'text'"
						:placeholder="popOps.inputPlaceholder"
						:maxlength="popOps.maxlength || 20"
						placeholder-class="text-gray"
						:style="handleInputStyle"
					/>
				</view>
				<!-- 输入框 end -->
			</view>
			<!-- 内容区域 end -->
			
			<!-- 按钮区域 start -->
			<view class="btn-box margin-top-lg flex" :class="[popOps.showCancel ? 'justify-between' : 'justify-center']" :style="handleBtnBoxStyle">
				<view class="btn cancel  text-center" @click="handleCancel" v-if="popOps.showCancel" :style="handleCancelBtnStyle">
					{{popOps.cancelText || '取消'}}
				</view>
				<view class="btn confirm text-center text-df-color" @click="handleConfirm" :style="handleConfirmBtnStyle">
					{{popOps.confirmText || '确认'}}
				</view>
			</view>
			<!-- 按钮区域 end -->
		</view>
	</cu-layer>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { toast } from '@/common/utils/util.js';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';
import {DfColor} from '@/common/style/variables.js'

// 定义 emits
const emits = defineEmits(['success']);

// 弹层配置
const layerOps = reactive({
	show: false
})

// 输入框的值
const inputValue = ref('');

// 弹窗配置
const popOps = reactive({
	title: '', // 标题
	titleStyle: {}, // 标题样式
	content: '', // 内容
	contentStyle: {}, // 内容样式
	showIcon: false, // 是否显示图标
	icon: '', // 图标地址
	iconStyle: {}, // 图标样式
	showInput: false, // 是否显示输入框
	inputType: 'text', // 输入框类型
	inputPlaceholder: '请输入', // 输入框占位文本
	maxlength: 20, // 输入框最大长度
	showCancel: true, // 是否显示取消按钮
	cancelText: '取消', // 取消按钮文本
	confirmText: '确认', // 确认按钮文本
	validator: null, // 输入框验证函数
	required: false, // 是否必填
	requiredMsg: '', // 必填提示文本
	success: null, // 确认回调
	wrapStyle: {
		padding:'30rpx'
	}, // 整体样式
	contentBoxStyle: {}, // 内容区域样式
	inputStyle: {}, // 输入框样式
	btnBoxStyle: {}, // 按钮区域样式
	cancelBtnStyle: {}, // 取消按钮样式
	confirmBtnStyle: {
		backgroundColor: DfColor,
		borderColor:DfColor,
		color: 'white'
	} // 确认按钮样式
})

// 处理整体样式
const handleWrapStyle = computed(() => {
	return convertStyles(popOps.wrapStyle);
})

// 处理内容区域样式
const handleContentBoxStyle = computed(() => {
	return convertStyles(popOps.contentBoxStyle);
})

// 处理标题样式
const handleTitleStyle = computed(() => {
	return convertStyles(popOps.titleStyle);
})

// 处理内容样式
const handleContentStyle = computed(() => {
	return convertStyles(popOps.contentStyle);
})

// 处理图标样式
const handleIconStyle = computed(() => {
	return convertStyles(popOps.iconStyle);
})

// 处理输入框样式
const handleInputStyle = computed(() => {
	return convertStyles(popOps.inputStyle);
})

// 处理按钮区域样式
const handleBtnBoxStyle = computed(() => {
	return convertStyles(popOps.btnBoxStyle);
})

// 处理取消按钮样式
const handleCancelBtnStyle = computed(() => {
	return convertStyles(popOps.cancelBtnStyle);
})

// 处理确认按钮样式
const handleConfirmBtnStyle = computed(() => {
	return convertStyles(popOps.confirmBtnStyle);
})

/**
 * @description 显示弹窗
 * @param {Object} options - 配置项
 */
function show(options = {}){
	Object.assign(popOps, options);
	layerOps.show = true;
	inputValue.value = '';
}

/**
 * @description 隐藏弹窗
 */
function hide(){
	layerOps.show = false;
}

/**
 * @description 处理取消
 */
function handleCancel(){
	hide();
	emits('success', {
		confirm: false,
		cancel: true
	});
}

/**
 * @description 处理确认
 */
function handleConfirm(){
	if(popOps.showInput){
		// 如果有验证函数，先验证
		if(popOps.validator){
			const validResult = popOps.validator(inputValue.value);
			if(validResult !== true){
				toast(validResult || '验证失败');
				return;
			}
		}
		// 如果要求必填
		if(popOps.required && !inputValue.value){
			toast(popOps.requiredMsg || '请输入内容');
			return;
		}
	}
	
	hide();
	emits('success', {
		confirm: true,
		cancel: false,
		value: inputValue.value
	});
}

// 对外暴露方法
defineExpose({
	show
})
</script>

<style lang="scss">
.pop-modal-icon {
	width: 680rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 50rpx 40rpx 40rpx;
	
	.content-box {
		.title {
			color: #333333;
			font-size: 32rpx;
		}
		
		.icon-box {
			.icon {
				width: 120rpx;
				height: 120rpx;
			}
		}
		
		.content {
			color: #666666;
			font-size: 28rpx;
		}
		
		.input-box {
			.input {
				width: 100%;
				height: 88rpx;
			}
		}
	}
	
	.btn-box {
		.btn {
			font-size: 36rpx;
			width: 284rpx;
			height: 88rpx;
			border-radius: 32rpx;
			border: 2px solid #999999;
			display: flex;align-items: center;justify-content: center;
			&.cancel {
				color: #999999;
				border-color:999999 ;
			}
			&.confirm {
				position: relative;
			}
		}
	}
}
</style> 