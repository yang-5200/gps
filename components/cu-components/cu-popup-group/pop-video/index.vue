<template>
	<view class="pop-video" v-if="show" @click="handleMaskClick">
		<view class="video-container" @click.stop>
			<!-- 顶部区域 -->
			<view class="video-header">
				<view class="header-left">
					<text class="video-title">{{ videoData.title || '视频播放' }}</text>
				</view>
				<view class="header-right">
					<view class="close-btn" @click="handleClose">
						<text class="cuIcon-roundclose text-white text-xxxl"></text>
					</view>
				</view>
			</view>
			
			<!-- 播放区域 -->
			<view class="video-player">
				<video 
					v-if="videoData.videoUrl"
					:src="videoData.videoUrl"
					:poster="videoData.poster"
					:controls="true"
					:autoplay="videoData.autoplay"
					:loop="videoData.loop"
					:muted="videoData.muted"
					:show-center-play-btn="true"
					:show-play-btn="true"
					:show-fullscreen-btn="true"
					:show-progress="true"
					:show-loading="true"
					class="video-element"
					@error="handleVideoError"
					@play="handleVideoPlay"
					@pause="handleVideoPause"
					@ended="handleVideoEnded"
				></video>
				<view v-else class="no-video">
					<text class="text-white">暂无视频</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from 'vue';

// 定义 emits
const emits = defineEmits(['success', 'close']);

// 响应式数据
const show = ref(false);
const videoData = reactive({
	title: '',
	videoUrl: '',
	poster: '',
	autoplay: false,
	loop: false,
	muted: false
});

/**
 * @description 显示视频播放器
 * @param {Object} options 配置选项
 */
function showVideo(options = {}) {
	console.log(options, '显示视频播放器');
	Object.assign(videoData, {
		title: options.title || '视频播放',
		videoUrl: options.videoUrl || '',
		poster: options.poster || '',
		autoplay: options.autoplay || false,
		loop: options.loop || false,
		muted: options.muted || false
	});
	show.value = true;
}

/**
 * @description 关闭视频播放器
 */
function handleClose() {
	show.value = false;
	emits('close');
	emits('success', {
		confirm: false,
		action: 'close'
	});
}

/**
 * @description 点击遮罩层
 */
function handleMaskClick() {
	handleClose();
}

/**
 * @description 视频播放错误
 */
function handleVideoError(e) {
	console.log('视频播放错误:', e);
	// emits('success', {
	// 	confirm: false,
	// 	action: 'error',
	// 	error: e
	// });
}

/**
 * @description 视频开始播放
 */
function handleVideoPlay(e) {
	console.log('视频开始播放:', e);
	// emits('success', {
	// 	confirm: true,
	// 	action: 'play',
	// 	event: e
	// });
}

/**
 * @description 视频暂停
 */
function handleVideoPause(e) {
	console.log('视频暂停:', e);
	// emits('success', {
	// 	confirm: true,
	// 	action: 'pause',
	// 	event: e
	// });
}

/**
 * @description 视频播放结束
 */
function handleVideoEnded(e) {
	console.log('视频播放结束:', e);
	// emits('success', {
	// 	confirm: true,
	// 	action: 'ended',
	// 	event: e
	// });
}

// 暴露方法给外部使用
defineExpose({
	show: showVideo
});
</script>

<style lang="scss" scoped>
.pop-video {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.9);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	
	.video-container {
		width: 100vw;
		height: 100vh;
		max-width: 800rpx;
		background: #000;
		border-radius: 16rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding-top: var(--status-bar-height);
		
		.video-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 30rpx 40rpx;
			background: rgba(0, 0, 0, 0.8);
			border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
			
			.header-left {
				flex: 1;
				
				.video-title {
					color: #fff;
					font-size: 32rpx;
					font-weight: 500;
				}
			}
			
			.header-right {
				.close-btn {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.1);
					
					&:active {
						background: rgba(255, 255, 255, 0.2);
					}
				}
			}
		}
		
		.video-player {
			position: relative;
			width: 100%;
			height: 500rpx;
			background: #000;
			flex-grow: 1;
			
			.video-element {
				width: 100%;
				height: 100%;
			}
			
			.no-video {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: #333;
			}
		}
	}
}
</style>
