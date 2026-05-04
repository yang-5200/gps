<template>
	<view class="page-wrap">
		<!-- 顶部导航栏 -->
		<cu-nav-bar :isBack="true" title-text="修改昵称" />

		<view class="page-content padding margin-top">
			<view class="input-card padding-lr padding-tb-lg bg-white">
				<text class="input-label text-profile-color text-30">昵称</text>
				<input 
					class="nickname-input text-32 margin-top" 
					v-model="nickname" 
					placeholder="请输入昵称（2-10个字符）" 
					placeholder-class="placeholder-text"
					maxlength="10"
					focus
				/>
				<view class="input-hint text-24 margin-top-sm">
					<text class="hint-text">支持中文、英文、数字，2-10个字符</text>
				</view>
			</view>

			<!-- 保存按钮 -->
			<view class="btn-wrap margin-top-xl padding-lr">
				<button class="save-btn text-white text-32" @tap="handleSave">保存</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toast } from '@/common/utils/util.js';

const nickname = ref('');
const originalNickname = ref('');

onLoad((options) => {
	console.log('修改昵称页面加载', options);
	if (options.nickname) {
		nickname.value = options.nickname;
		originalNickname.value = options.nickname;
	}
});

/**
 * @description 保存昵称
 */
function handleSave() {
	const value = nickname.value.trim();

	if (!value) {
		toast('请输入昵称');
		return;
	}

	if (value.length < 2 || value.length > 10) {
		toast('昵称长度需在2-10个字符之间');
		return;
	}

	// 如果没有修改，直接返回
	if (value === originalNickname.value) {
		uni.navigateBack();
		return;
	}

	// TODO: 调用 API 保存昵称
	console.log('保存昵称:', value);

	// 保存成功后返回上一页并刷新数据
	const pages = getCurrentPages();
	const prevPage = pages[pages.length - 2];
	if (prevPage && prevPage.$vm) {
		prevPage.$vm.nickname = value;
	}

	toast('修改成功', 'success');
	setTimeout(() => {
		uni.navigateBack();
	}, 800);
}
</script>

<style lang="scss" scoped>
.text-profile-color {
	color: #232222;
}

.page-wrap {
	min-height: 100vh;
	background-color: #f8f8f8;

	.page-content {
		padding-top: 30rpx;

		.input-card {
			border-radius: 32rpx;
			overflow: hidden;

			.input-label {
				color: #666;
			}

			.nickname-input {
				height: 80rpx;
				border-bottom: 2rpx solid #f0f0f0;
				color: #232222;
			}

			.placeholder-text {
				color: #999;
			}

			.input-hint {
				.hint-text {
					color: #999;
				}
			}
		}

		.btn-wrap {
			.save-btn {
				height: 96rpx;
				line-height: 96rpx;
				border-radius: 48rpx;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border: none;

				&:active {
					opacity: 0.9;
				}
			}
		}
	}
}
</style>
