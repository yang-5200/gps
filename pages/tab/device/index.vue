<template>
  <view class="page-wrap flex-column" :class="{ 'bg-fafafa': deviceList.length > 0 }">
    <!-- 顶部导航栏 -->
    <cu-nav-bar :isBack="false" alignMode="left" title-text="智购互联" color="#4E1200"
      :background="deviceList.length > 0 ? '#FAFAFA' : navbarImmerse.navBar.backgroundColor">
      <template #left>
        <view class="flex align-center margin-left margin-right-sm">
          <image style="width: 52rpx; height: 52rpx;" src="/static/images/logo/logo.png" mode="aspectFit"></image>
        </view>
      </template>
    </cu-nav-bar>

    <view class="page-content margin-top-sm padding-lr flex-grow-1 flex-column">
      <!-- 有设备时显示设备列表 -->
      <template v-if="deviceList.length > 0">
        <view class="device-list-wrap  ">
          <view class="device-item bg-white radius-df margin-bottom-20 relative" v-for="device in deviceList"
            :key="device.id" @tap="viewDeviceDetail(device)" @longpress="handleLongPress(device)">
            <view class="flex justify-start align-center padding-tb-38 padding-lr-24">
              <!-- 设备图片 -->
              <view class="margin-right-24 flex align-center">
                <image src="/static/images/equip/equip.png" class="box-size-w-81 box-size-h-63" mode="aspectFit"></image>
              </view>
              <!-- 设备信息 -->
              <view class="flex flex-direction justify-between box-size-h-63">

                <view class="">
                  <text class="text-30">{{ device.name }}</text>
                </view>

                <view class="text-xs text-gray">
                  设备序列号： {{ device.imei }}
                </view>

                <view class="text-xs text-gray">
                  当前位置： {{ device.location }}
                </view>


              </view>


            </view>



            <!-- 右上角电量 -->
            <view class="flex items-center" style="position: absolute; top: 20rpx; right: 20rpx; z-index: 10;">
              <image src="/static/images/charge.png" style="width: 32rpx; height: 32rpx; display: block;" class="margin-right-sm" mode="aspectFit"></image>
              <text class="text-24 text-green" style="line-height: 32rpx;">电量：90%</text>
            </view>
          </view>

        </view>

        <!-- 固定悬浮添加按钮 -->
       <!-- <image class="add-floating-btn" src="/static/images/add-flacility.png" mode="aspectFit" @tap="addDevice">
        </image> -->
				<view class="add-floating-btn " @tap="addDevice">
					<view class="flex flex-direction align-center justify-center">
						<image src="/static/images/add-flacity.png" class="box-size-54" mode="aspectFit"></image>
						<view class="margin-top-8">
							<text class="text-28 text-df-color text-hidden">添加设备</text>
						</view>
						
					</view>
					
				</view>
      </template>

      <!-- 无设备时显示空状态 -->
      <template v-else>
        <view class="bg-white flex-grow-1 margin-top-20 flex-column justify-center radius-df padding-bottom-120"
          style="margin-bottom: 28rpx;">
          <!-- 设备展示图 -->
          <view class="flex justify-center align-center">
            <image src="/static/images/equip/equip.png" mode="aspectFit"></image>
          </view>

          <view class="padding-lr-160 margin-top-lg">
            <view class="text-center bg-df-color padding-tb radius-180" @tap="addDevice">
              <text class="text-white">添加设备</text>
            </view>
          </view>
        </view>
      </template>
    </view>

    <!-- 底部导航栏 -->
    <cu-popup ref="deletePopupRef" mode="modal" :isTabbarPage="true"></cu-popup>
    <CustomTabBar current-name="device" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toPath, toast } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '../components/useTabBar.js';
import CustomTabBar from '../components/custom-tab-bar/custom-tab-bar.vue';

// 隐藏原生 TabBar
useTabBar();

const { navbarImmerse } = useNavbarImmerse();

const deviceList = ref([]);
const deletePopupRef = ref(null);

// 假数据 - 初始设备
const mockData = [
  { 
    id: 1, 
    imei: '55666321', 
    name: '郑州火车站设备', 
    status: '在线', 
    addTime: '2026-01-15 10:30',
    latitude: 34.7486,
    longitude: 113.6585,
    location: '郑州二七广场火车站'
  },
  { 
    id: 2, 
    imei: '55666322', 
    name: '洛阳火车站设备', 
    status: '在线', 
    addTime: '2026-01-20 14:20',
    latitude: 34.6853,
    longitude: 112.4342,
    location: '洛阳火车站'
  },
  { 
    id: 3, 
    imei: '55666323', 
    name: '万象城设备', 
    status: '在线', 
    addTime: '2026-01-25 09:15',
    latitude: 34.7466,
    longitude: 113.6253,
    location: '二七区嵩山南路交叉口万象城'
  }
];

onLoad((options) => {
  console.log('设备页面加载', options);
  // 首次加载时初始化假数据（如果本地没有数据，或者数据中缺少经纬度信息）
  const storedDevices = uni.getStorageSync('deviceList');
  const needsUpdate = !storedDevices || storedDevices.length === 0 || !storedDevices[0].latitude;
  
  if (needsUpdate) {
    // 强制使用最新的假数据
    uni.setStorageSync('deviceList', mockData);
    deviceList.value = mockData;
  } else {
    deviceList.value = storedDevices;
  }
});

// 每次显示页面时刷新设备列表
onShow(() => {
  const storedDevices = uni.getStorageSync('deviceList') || [];
  deviceList.value = storedDevices;
});

/**
 * @description 添加设备
 */
function addDevice() {
  toPath('/pages/views/device/add/index');
}

/**
 * @description 查看设备详情
 */
function viewDeviceDetail(device) {
  toPath(`/pages/views/device/detail/index?id=${device.id}`);
}

/**
 * @description 长按处理
 */
function handleLongPress(device) {
  uni.showActionSheet({
    itemList: ['删除设备'],
    itemColor: '#ff0000',
    success: (res) => {
      if (res.tapIndex === 0) {
        confirmDelete(device);
      }
    }
  });
}

/**
 * @description 确认删除设备
 */
function confirmDelete(device) {
  deletePopupRef.value.show({
    title: '提示',
    content: `确定要删除设备 "${device.name}" 吗？`,
    success: (res) => {
      if (res.confirm) {
        deleteDevice(device);
      }
    }
  });
}

/**
 * @description 执行删除设备
 */
function deleteDevice(device) {
  // 从列表中移除
  const index = deviceList.value.findIndex(item => item.id === device.id);
  if (index !== -1) {
    deviceList.value.splice(index, 1);
    // 更新本地存储
    uni.setStorageSync('deviceList', deviceList.value);
    toast('删除成功');
  }
}
</script>

<style lang="scss">
	.margin-top-8{
		margin-top: 8rpx;
	}
page {
  height: 100%;
}
.text-24{
	font-size: 24rpx;
}
.padding-bottom-120 {
  padding-bottom: 120rpx;
}
.margin-top-20 {
margin-top: 20rpx;
}

.radius-180 {
border-radius: 180rpx;
}

.device-item {
  height: 202rpx;
  position: relative;
}

.padding-tb-38 {
  padding-top: 38rpx;
  padding-bottom: 38rpx;
}

.padding-lr-160 {
padding-left: 160rpx;
padding-right: 160rpx;
}

.bg-fafafa {
background-color: #FAFAFA;
}

.add-floating-btn {
position: fixed;
right: 52rpx;
bottom: calc(124rpx + 132rpx + 44rpx + env(safe-area-inset-bottom));
width: 110rpx;
height: 150rpx;
z-index: 100;
}

.page-wrap {
min-height: 100vh;
position: relative;
transition: background-color 0.3s;

.page-content {
padding-bottom: calc(176rpx + env(safe-area-inset-bottom)); // 避开底部悬浮 TabBar

.device-list-wrap {}
}

}

</style>


