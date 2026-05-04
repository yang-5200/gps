<template>
	<view class="page-wrap">
		<!-- 顶部导航栏 -->
		<cu-nav-bar :isBack="true" title-text="修改头像" />

		<view class="page-content flex flex-direction align-center padding-lg">
			<!-- 头像预览区域 -->
			<view class="avatar-preview-wrap margin-top-xl">
				<image 
					class="avatar-preview round" 
					:src="avatarUrl || '/static/images/profile.png'" 
					mode="aspectFill"
				/>
			</view>

			<!-- 提示文字 -->
			<text class="hint-text text-28 margin-top-lg">点击按钮更换头像</text>

			<!-- 操作按钮区域 -->
			<view class="btn-wrap margin-top-xl width-100 padding-lr">
				<button class="action-btn text-white text-32 margin-bottom" @tap="handleChooseFromAlbum">从相册选择</button>
				<button class="action-btn secondary text-32 margin-bottom" @tap="handleTakePhoto">拍照</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toast, loading } from '@/common/utils/util.js';

const avatarUrl = ref('');
const originalAvatar = ref('');

onLoad((options) => {
	console.log('修改头像页面加载', options);
	if (options.avatar) {
		avatarUrl.value = options.avatar;
		originalAvatar.value = options.avatar;
	}
});

/**
 * @description 从相册选择图片
 */
function handleChooseFromAlbum() {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0];
			uploadAvatar(tempFilePath);
		},
		fail: (err) => {
			console.log('选择图片失败:', err);
		}
	});
}

/**
 * @description 拍照
 */
function handleTakePhoto() {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0];
			uploadAvatar(tempFilePath);
		},
		fail: (err) => {
			console.log('拍照失败:', err);
		}
	});
}

/**
 * @description 上传头像
 * @param {string} filePath - 图片临时路径
 */
function uploadAvatar(filePath) {
	loading('上传中...');

	// TODO: 调用实际上传接口
	// 这里模拟上传成功
	setTimeout(() => {
		uni.hideLoading();
		avatarUrl.value = filePath;

		// 保存成功后返回上一页并刷新数据
		const pages = getCurrentPages();
		const prevPage = pages[pages.length - 2];
		if (prevPage && prevPage.$vm) {
			// 更新上一页的头像显示
			prevPage.$vm.avatarUrl = filePath;
		}

		toast('头像更新成功', 'success');
		setTimeout(() => {
			uni.navigateBack();
		}, 800);
	}, 1500);

	/* 实际上传代码示例：
	uni.uploadFile({
		url: 'YOUR_UPLOAD_API',
		filePath: filePath,
		name: 'file',
		success: (res) => {
			uni.hideLoading();
			const data = JSON.parse(res.data);
			if (data.code === 200) {
				avatarUrl.value = data.data.url;
				toast('上传成功', 'success');
				// 返回上一页...
			} else {
				toast(data.msg || '上传失败');
			}
		},
		fail: () => {
			uni.hideLoading();
			toast('上传失败，请重试');
		}
	});
	*/
}
</script>

<style lang="scss" scoped>
.page-wrap {
	min-height: 100vh;
	background-color: #f8f8f8;

	.page-content {
		.avatar-preview-wrap {
			.avatar-preview {
				width: 240rpx;
				height: 240rpx;
				border: 6rpx solid #fff;
				box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
			}
		}

		.hint-text {
			color: #666;
		}

		.btn-wrap {
			.action-btn {
				height: 96rpx;
				line-height: 96rpx;
				border-radius: 48rpx;
				background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
				border: none;

				&:active {
					opacity: 0.9;
				}

				&.secondary {
					background: #ffe4e1;
					color: #dc143c;
					border: none;
				}
			}
		}
	}
}
</style>
