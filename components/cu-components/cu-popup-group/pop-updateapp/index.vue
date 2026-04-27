<template>
	<cu-layer v-model="isShow" mode="center" :maskClosable="popObj.isBack" @close="cancel()">
		<view class="modal-pop bg-white">
			<view class="pop-head">
				<view v-if="popObj.title" class="title" :style="popObj.titleStyle">
					APP升级提醒
				</view>
			</view>
			<view class="pop-body">
				<view class="cPopup-center padding">
					<view class="margin-bottom-xs">
						版本：{{renewInfo.version}}
					</view>
					<view class="margin-bottom-xs">
						大小：{{renewInfo.size}}
					</view>
					<view v-if="renewInfo.content" class="margin-bottom-xs">
						更新内容：{{renewInfo.content}}
					</view>
					<view>
						正在为您更新，请耐心等待
					</view>
					<view class="flex align-center margin-top">
						<view class="flex-grow-1 cu-progress round">
							<view class="bar" :style="{ width:progress+'%'}"></view>
						</view>
						<text class="flex-shrink-zero margin-left-xs" style="width: 80rpx;">{{progress}}%</text>
					</view>
				</view>
			</view>
		</view>
	</cu-layer>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { convertStyles } from '@/common/utils/styleHandleUtil.js';

// 响应式数据
const isShow = ref(false);
const progress = ref(0);
const popObj = reactive({});
const renewInfo = reactive({
	version: '',
	size: '',
	content: ''
});

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
		confirmTextColor: '#B59453',
		...data,
		showCancel: data.showCancel === false ? false : true
	});

	isShow.value = true;
	
	// console.log(uni.downloadTask, 'uni.downloadTask');
	
	// 监听下载进度
	uni.downloadTask.onProgressUpdate(res => {
		progress.value = res.progress;
		// console.log('下载进度', progress.value);
		if (progress.value >= 100) {
			setTimeout(() => {
				confirm();
			}, 1000)
		}
	});

	// 更新信息
	Object.assign(renewInfo, uni.renewInfo || {});
}

/**
 * @description 确定
 */
function confirm() {
	hide();
	emits('success', { confirm: true });
}

/**
 * @description 取消
 */
function cancel() {
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
</script>

<style lang="scss">
@import './index.scss';
</style>
