<template>
	<view class="cu-load-more" :class="{'safe-area': safeAreaInsetBottom}">
		<view v-if="status === 'loading' && showIcon" class="cu-load-more__img">
			<view class="load1 load">
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
			</view>
			<view class="load2 load">
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
			</view>
			<view class="load3 load">
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
				<view :style="{ background: color }" class="uni-load-view_wrapper" />
			</view>
		</view>
		<text :style="{ color: color }" class="cu-load-more__text" v-if="loadType == 'load'">
			{{ status === 'more' ? contentText.contentdown : status === 'loading' ? contentText.contentrefresh : contentText.contentnomore }}
		</text>
	</view>
</template>

<script setup>
	const props = defineProps({
		status: {
			// 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
			type: String,
			default: 'more'
		},
		showIcon: {
			type: Boolean,
			default: true
		},
		color: {
			type: String,
			default: '#777777'
		},
		contentText: {
			type: Object,
			default () {
				return {
					contentdown: '上拉显示更多',
					contentrefresh: '正在加载...',
					contentnomore: '没有更多数据了'
				}
			}
		},
		loadType: { //组件类型 load默认 full全屏
			type: String,
			default () {
				return 'load'
			}
		},
		// 是否适配底部安全区
		safeAreaInsetBottom: {
			type: Boolean,
			default: true
		}
	})
</script>

<style lang="scss">
	$uni-text-color-grey: grey;
	.cu-load-more {
		display: flex;
		flex-direction: row;
		min-height: 80rpx;
		align-items: center;
		justify-content: center;
		
		&.safe-area {
			min-height: calc(80rpx + constant(safe-area-inset-bottom)); /* iOS 11.0 */
			min-height: calc(80rpx + env(safe-area-inset-bottom)); /* iOS 11.2+ */
			padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
			padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
		}

		.cu-load-more__img {
			margin: 0;
		}

		.cu-load-more__text {
			margin-left: 20rpx;
		}

		&__text {
			font-size: 28rpx;
			color: $uni-text-color-grey;
		}

		&__img {
			height: 24px;
			width: 24px;
			margin-right: 10px;

			&>.load {
				position: absolute;

				.uni-load-view_wrapper {
					width: 6px;
					height: 2px;
					border-top-left-radius: 1px;
					border-bottom-left-radius: 1px;
					background: $uni-text-color-grey;
					position: absolute;
					opacity: 0.2;
					transform-origin: 50%;
					animation: load 1.56s ease infinite;

					&:nth-child(1) {
						transform: rotate(90deg);
						top: 2px;
						left: 9px;
					}

					&:nth-child(2) {
						transform: rotate(180deg);
						top: 11px;
						right: 0px;
					}

					&:nth-child(3) {
						transform: rotate(270deg);
						bottom: 2px;
						left: 9px;
					}

					&:nth-child(4) {
						top: 11px;
						left: 0px;
					}
				}
			}
		}

		.load1,
		.load2,
		.load3 {
			height: 24px;
			width: 24px;
		}

		.load2 {
			transform: rotate(30deg);
		}

		.load3 {
			transform: rotate(60deg);
		}

		.load1 .uni-load-view_wrapper:nth-child(1) {
			animation-delay: 0s;
		}

		.load2 .uni-load-view_wrapper:nth-child(1) {
			animation-delay: 0.13s;
		}

		.load3 .uni-load-view_wrapper:nth-child(1) {
			animation-delay: 0.26s;
		}

		.load1 .uni-load-view_wrapper:nth-child(2) {
			animation-delay: 0.39s;
		}

		.load2 .uni-load-view_wrapper:nth-child(2) {
			animation-delay: 0.52s;
		}

		.load3 .uni-load-view_wrapper:nth-child(2) {
			animation-delay: 0.65s;
		}

		.load1 .uni-load-view_wrapper:nth-child(3) {
			animation-delay: 0.78s;
		}

		.load2 .uni-load-view_wrapper:nth-child(3) {
			animation-delay: 0.91s;
		}

		.load3 .uni-load-view_wrapper:nth-child(3) {
			animation-delay: 1.04s;
		}

		.load1 .uni-load-view_wrapper:nth-child(4) {
			animation-delay: 1.17s;
		}

		.load2 .uni-load-view_wrapper:nth-child(4) {
			animation-delay: 1.3s;
		}

		.load3 .uni-load-view_wrapper:nth-child(4) {
			animation-delay: 1.43s;
		}
	}
	
	@keyframes load {
		0% {
			opacity: 1;
		}
	
		100% {
			opacity: 0.2;
		}
	}
</style>