<template>
	<view class="page-wrap">
		<!-- 顶部导航栏 -->
		<cu-nav-bar :isBack="true" title-text="个人资料" />

		<view class="page-content padding margin-top">
			<view class="profile-card padding-lr padding-bottom-xs bg-white">
				<!-- 头像 -->
				<view class="profile-item padding-tb flex justify-between align-center padding-top border-bottom" @tap="handleUpdateAvatar">
					<text class="item-label text-profile-color text-30">头像</text>
					<view class="item-right flex align-center">
						<cu-img class="avatar box-size-w-35 box-size-h-35 round" :src="avatarUrl || '/static/images/profile.png'" mode="aspectFill" :styles="{ backgroundColor: '#f0f0f0' }" />
						<view class="box-size-16 flex align-center justify-center">
							<image src="/static/images/right-addrow.png" class="box-size-w-6 box-size-h-8 margin-left-xs" mode=""></image>
						</view>
					</view>
				</view>

				<!-- 昵称 -->
				<view class="profile-item padding-tb flex justify-between align-center border-bottom" @tap="handleUpdateNickname">
					<text class="item-label text-profile-color text-30">昵称</text>
					<view class="item-right flex align-center">
						<text class="item-value text-28 text-profile-color">{{ nickname }}</text>
						<view class="box-size-16 flex align-center justify-center">
							<image src="/static/images/right-addrow.png" class="box-size-w-6 box-size-h-8 margin-left-xs" mode=""></image>
						</view>
					</view>
				</view>

				<!-- 手机号 -->
				<view class="profile-item padding-tb flex justify-between align-center">
					<text class="item-label text-profile-color text-30">手机号</text>
					<view class="item-right flex align-center">
						<text class="item-value text-profile-color">16545823385</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toPath } from '@/common/utils/util.js';

const nickname = ref('忍冬');
const avatarUrl = ref('');

onLoad(() => {
	console.log('个人资料页面加载');
	// TODO: 从缓存或接口获取用户信息
});

onShow(() => {
	// 页面显示时刷新数据（从其他页面返回时）
	console.log('个人资料页面显示');
});

/**
 * @description 跳转到头像修改页面
 */
function handleUpdateAvatar() {
	toPath({
		path: '/pages/views/profile/edit-avatar/index',
		query: { avatar: avatarUrl.value }
	});
}

/**
 * @description 跳转到昵称修改页面
 */
function handleUpdateNickname() {
	toPath({
		path: '/pages/views/profile/edit-nickname/index',
		query: { nickname: nickname.value }
	});
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

		.profile-card {
			border-radius: 32rpx;
			overflow: hidden;

			.profile-item {
				.item-label {
					color: #232222;
				}

				.item-value {
					color: #232222;
				}

				.avatar {
					background-color: #f0f0f0;
				}
			}
		}
	}
}
</style>
