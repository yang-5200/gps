<template>
	<view class="page-wrap bg-df-color">
		<!-- 顶部导航栏 -->
		<cu-nav-bar :isBack="true" title-text="历史轨迹" :background="navbarImmerse.navBar.backgroundColor"></cu-nav-bar>

		<view class="page-content padding-lr-sm">
			<cu-load-list :len="len" :loadStatus="pagination.loadStatus" :loadTextObj="pagination.loadTextObj">
				<template #not-data>
					<view class="empty-project flex flex-direction align-center justify-center margin-top-75">
						<image src="/static/not-data.png" style="width: 168rpx; height: 168rpx;" class="empty-img margin-bottom" mode="aspectFit">
						</image>
						<text class="empty-text text-32 text-gray-2">暂无数据</text>
					</view>
				</template>

				<view class="history-list">
					<view class="history-item flex justify-between align-center  margin-top-sm"
						v-for="(item, index) in listData" :key="index" @tap="toDetail(item)">
						<view class="padding-tb-20">
							<text>{{ item.title }}</text>
						</view>

						<view class="cuIcon-right">

						</view>
					</view>
				</view>
			</cu-load-list>
		</view>





	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { http } from 'uview-plus';
import urls from '@/common/api/urls.js';
import { toPath } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '@/pages/tab/components/useTabBar.js';
import { useLoadList } from '@/common/utils/useLoadList.js';

const { navbarImmerse } = useNavbarImmerse();

// 隐藏原生 TabBar
useTabBar();


const deviceId = ref('');
const deviceName = ref('');
const listData = ref([]);

/**
 * 获取历史轨迹列表
 */
const getList = () => {
	pagination.loadStatus = 'loading';

	// 这里模拟接口请求
	// 实际开发时应使用 http.post(urls.deviceHistory, { device_id: deviceId.value, ... })
	setTimeout(() => {
		const mockData = [
			{ id: 1, date: '2026.4.24', title: '2026.4.24行动轨迹' },
			{ id: 2, date: '2026.4.23', title: '2026.4.23行动轨迹' },
			{ id: 3, date: '2026.4.22', title: '2026.4.22行动轨迹' },
		];

		if (pagination.pageNo === 1) {
			listData.value = mockData;
		} else {
			// 模拟加载更多（如果有的话）
			// listData.value = listData.value.concat(mockData);
		}

		pagination.total = mockData.length;
		pagination.loadStatus = listData.value.length < pagination.total ? 'more' : 'noMore';
	}, 800);
};

const { pagination, len } = useLoadList({
	listData,
	getList,
});

/**
 * 跳转到详情
 */
const toDetail = (item) => {
	toPath(`/pages/views/device/history/detail/index?id=${deviceId.value}&date=${item.date}`);
};

onLoad((options) => {
	deviceId.value = options.id;
	deviceName.value = options.name;
	getList();
});
</script>

<style lang="scss" scoped>
.margin-top-75 {
	margin-top: 75rpx;
}

.page-wrap {
	background-color: #FAFAFA;

	.page-content {
		padding: 40rpx;
		text-align: center;
	}
}

.history-item {
	padding-left: 42rpx;
	padding-right: 28rpx;
	border-radius: 15px;
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid #FFFFFF;
	backdrop-filter: blur(10px) saturate(100%);
}
</style>
