<template>
	<view class="page-wrap">
		<!-- 顶部导航栏 -->
		<cu-nav-bar title-text="轨迹详情" :isBack="true" />

		<!-- 地图区域 -->
		<map id="historyMap" class="map" :latitude="latitude" :longitude="longitude" :polyline="polyline" :markers="markers"
			:show-location="false"></map>

		<!-- 底部信息浮层 -->
		<view class="info-panel">
			<view class="info-card">
				<view class="flex justify-between align-center margin-bottom-sm">
					<text class="text-32 text-bold">轨迹概览</text>
					<text class="text-28 text-gray">{{ date }}</text>
				</view>
				<view class="flex justify-around">
					<view class="info-item flex flex-direction align-center">
						<text class="text-36 text-bold">5.2</text>
						<text class="text-24 text-gray">里程(km)</text>
					</view>
					<view class="info-item flex flex-direction align-center">
						<text class="text-36 text-bold">45</text>
						<text class="text-24 text-gray">用时(min)</text>
					</view>
					<view class="info-item flex flex-direction align-center">
						<text class="text-36 text-bold">12.5</text>
						<text class="text-24 text-gray">均速(km/h)</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const latitude = ref(34.7466);
const longitude = ref(113.6253);
const date = ref('');

// 模拟轨迹点数据 (Mock Data)
// 实际开发中，这些数据将从后端接口获取
const polyline = ref([{
	points: [
		{ latitude: 34.7466, longitude: 113.6253 },
		{ latitude: 34.7480, longitude: 113.6260 },
		{ latitude: 34.7490, longitude: 113.6280 },
		{ latitude: 34.7500, longitude: 113.6300 },
		{ latitude: 34.7510, longitude: 113.6320 },
		{ latitude: 34.7500, longitude: 113.6340 },
		{ latitude: 34.7480, longitude: 113.6350 },
		{ latitude: 34.7460, longitude: 113.6340 },
		{ latitude: 34.7450, longitude: 113.6320 },
		{ latitude: 34.7466, longitude: 113.6253 }
	],
	color: '#FF5722',
	width: 6,
	arrowLine: true,
	dottedLine: false
}]);

// 标记起点和终点
const markers = ref([
	{
		id: 1,
		latitude: 34.7466,
		longitude: 113.6253,
		iconPath: '/static/images/location.png', // 这里可以用起点的图标
		width: 32,
		height: 32,
		label: {
			content: '起点',
			color: '#ffffff',
			bgColor: '#4cd964',
			padding: 4,
			borderRadius: 4
		}
	},
	{
		id: 2,
		latitude: 34.7466,
		longitude: 113.6253,
		iconPath: '/static/images/location.png', // 这里可以用终点的图标
		width: 32,
		height: 32,
		label: {
			content: '终点',
			color: '#ffffff',
			bgColor: '#FF5722',
			padding: 4,
			borderRadius: 4
		}
	}
]);

onLoad((options) => {
	if (options.date) {
		date.value = options.date;
	}
	// 在实际应用中，这里会根据 deviceId 和 date 调用接口获取轨迹点
});
</script>

<style lang="scss" scoped>
.page-wrap {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.map {
	flex: 1;
	width: 100%;
}

.info-panel {
	position: absolute;
	bottom: 40rpx;
	left: 20rpx;
	right: 20rpx;
	z-index: 10;
}

.info-card {
	background: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(10px);
	border-radius: 30rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.info-item {
	.text-36 {
		font-size: 36rpx;
		color: #333;
	}
	.text-24 {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}
}
</style>
