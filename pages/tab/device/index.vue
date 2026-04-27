<template>
  <view class="page-wrap flex-column">
    <!-- 顶部导航栏 -->
    <cu-nav-bar :isBack="false" alignMode="left" title-text="智购互联" color="#4E1200"
      :background="navbarImmerse.navBar.backgroundColor">
      <template #left>
        <view class="flex align-center margin-left margin-right-sm">
          <image class="box-size-26" src="/static/images/logo/logo.png" mode="aspectFit"></image>
        </view>
      </template>
    </cu-nav-bar>
    
    <view class="page-content padding-lr flex-grow-1 flex-column">
      <!-- 有设备时显示设备列表 -->
      <template v-if="deviceList.length > 0">
        <view class="device-list-wrap flex-grow-1 margin-tb-20">
          <view 
            class="device-item bg-white radius-df padding-xs box-size-h-101 margin-bottom-20 " 
            v-for="device in deviceList" 
            :key="device.id"
            @tap="viewDeviceDetail(device)"
          >
            <view class="flex align-center ">
              <!-- 设备图片 -->
              <view class="device-icon-wrap margin-right box-size-81  box-size-h-63">
                <image class="device-icon w100 h100" src="/static/images/equip/equip.png" mode="aspectFit"></image>
              </view>
              
              <!-- 设备信息 -->
              <view class=" flex flex-direction justify-between ">
                <view class=" ">
                  <text class="text-30 text-bold">{{ device.name }}</text>
                </view>
                <view class="text-xs text-gray">序列号：{{ device.imei }}</view>
								
								<!-- 当前位置 -->
								<view class="">
									<text class="text-xs ">当前位置： </text>
								</view>
              </view>
              
              
            </view>
          </view>
          
          <!-- 继续添加设备按钮 -->
          <view class="padding-lr-160 margin-top-lg">
            <view class="text-center bg-df-color padding-tb radius-180" @tap="addDevice">
              <text class="text-white">继续添加设备</text>
            </view>
          </view>
        </view>
      </template>
      
      <!-- 无设备时显示空状态 -->
      <template v-else>
        <view class="bg-white flex-grow-1 margin-tb-20 flex-column justify-center radius-df padding-bottom-120">
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
    <CustomTabBar current-name="device" />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { toPath, toast } from '@/common/utils/util.js';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '../components/useTabBar.js';
import CustomTabBar from '../components/CustomTabBar.vue';

// 隐藏原生 TabBar
useTabBar();

const { navbarImmerse } = useNavbarImmerse();

const deviceList = ref([]);

// 假数据 - 初始设备
const mockData = [
  { id: 1, imei: '55666323', name: '我的设备1', status: '在线', addTime: '2026-01-15 10:30' },
  { id: 2, imei: '99887766', name: '车载定位器', status: '离线', addTime: '2026-01-20 14:20' }
];

onLoad((options) => {
  console.log('设备页面加载', options);
  // 首次加载时初始化假数据（如果本地没有数据）
  const storedDevices = uni.getStorageSync('deviceList');
  if (!storedDevices || storedDevices.length === 0) {
    // 首次加载使用假数据
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
  toPath('/pages/views/device/add');
}

/**
 * @description 查看设备详情
 */
function viewDeviceDetail(device) {
  toast(`查看设备: ${device.name}`);
  // 实际项目中跳转到设备详情页
  // toPath(`/pages/views/device/detail?id=${device.id}`);
}
</script>

<style lang="scss">
page {
  height: 100%;
}
.padding-tb-34{
	padding-top: 34rpx;
	padding-bottom: 34rpx;
}
.padding-bottom-120 {
  padding-bottom: 120rpx;
}

.margin-bottom-20 {
  margin-bottom: 20rpx;
}

.margin-tb-20 {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.radius-180 {
  border-radius: 180rpx;
}

.padding-lr-160 {
  padding-left: 160rpx;
  padding-right: 160rpx;
}

.page-wrap {
  height: 100%;
  position: relative;

  .page-content {
    padding-bottom: 176rpx; // 避开底部悬浮 TabBar
    
    .device-list-wrap {
			
		}
  }

  /* 消除 TabBar 默认的占位 */
  ::v-deep .tab-bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0;
  }
}
</style>
