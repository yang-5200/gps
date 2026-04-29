<template>
	<view class="page-wrap pg-df-color">
		<view class="page-content flex-column align-center">
			<!-- Logo 区域 -->
			<view class="logo-box flex-column align-center margin-top-300">
				<image class="logo-img box-size-w-100 box-size-h-100" src="/static/images/logo/logo.png"
					mode="aspectFit"></image>
				<view class="margin-top"></view>
				<image class="box-size-w-150 box-size-h-27" src="/static/images/logo/logo-zg.png" mode="aspectFit">
				</image>
			</view>

			<!-- 登录按钮区域 -->
			<view class="login-btn-box margin-top-140 w100 padding-lr-df">
				<button
					class="login-btn w100 box-size-h-49 radius-df text-df text-white flex align-center justify-center"
					style="background-color: #5d4037" @click="handleWxLogin">
					微信授权登录
				</button>
				<button
					class="login-btn w100 box-size-h-49 radius-df text-df text-white flex align-center justify-center bg-blue margin-top-140"
					@click="handleLoginClick">
					模拟登录
				</button>
			</view>

			<!-- 底部协议区域 -->
			<cu-page-footer :isFixed="true" background="transparent">
				<view class="protocol-box padding-tb flex justify-center align-center h100">
					<cu-radio v-model="isAgree" is-data-type="boo" active-color="#5D4037" inactive-color="#999"
						size="26rpx" style="margin-top: 5rpx;">
					</cu-radio>
					<view class="protocol-text flex align-center justify-center margin-left-xs" @click="toggleAgree">
						<text class="text-gray text-26">已阅读并同意</text>
						<text class="protocol-link text-26" @click.stop="toProtocol('service')">《服务协议》</text>
						<text class="text-gray text-26">和</text>
						<text class="protocol-link text-26" @click.stop="toProtocol('privacy')">《隐私协议》</text>
					</view>
				</view>
			</cu-page-footer>

		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { http, urls } from '@/common/api/index.js';
import { toPath, toast, loading } from '@/common/utils/util.js';

const isAgree = ref(false);

/**
 * @description 跳转设备列表页面	
 */
function handleLoginClick() {
	toPath({
	path:'/pages/tab/device/index',
	type:'switchTab',
	});
}



/**
 * @description 切换同意状态
 */
function toggleAgree() {
	isAgree.value = !isAgree.value;
}

/**
 * @description 微信授权登录
 */
async function handleWxLogin() {
	if (!isAgree.value) {
		toast('请先阅读并同意服务协议和隐私协议');
		return;
	}

	loading('登录中...');

	try {
		// #ifdef MP-WEIXIN
		const loginRes = await uni.login({ provider: 'weixin' });
		console.log('微信登录code', loginRes.code);

		// 调用后端登录接口
		const res = await http.post(urls.login.wxLogin, { code: loginRes.code });
		if (res.code === 1) {
			toast('登录成功');
			// 保存登录态
			uni.setStorageSync('token', res.data.token);
			// 返回上一页或跳转到首页
			const pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				toPath('/pages/index/index');
			}
		} else {
			toast(res.msg || '登录失败');
		}
		// #endif

		// #ifndef MP-WEIXIN
		toast('请在微信小程序中使用微信登录');
		// #endif
	} catch (error) {
		toast(error.msg || '登录失败');
		console.error('微信登录失败', error);
	} finally {
		uni.hideLoading();
	}
}

/**
 * @description 查看协议
 * @param {string} type - 协议类型 service|privacy
 */
function toProtocol(type) {
	toPath({
		path: '/pages/protocol/index',
		query: { type }
	});
}

onLoad(() => {
	console.log('登录页面加载');
});
</script>

<style lang="scss">
	.margin-top-140{
		margin-top: 140rpx;
	}
	
.margin-top-300 {
	margin-top: 300rpx;
}

.padding-bottom-34 {
	padding-bottom: 34rpx;
}

.page-wrap {
	min-height: 100vh;
	background-color: #f5f5f0;
}
</style>
