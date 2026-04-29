<template>
  <view class="page-wrap">
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="我的设备" :isBack="true" color="#000" />

    <!-- 地图背景 -->
    <map id="myMap" class="map-bg" :latitude="latitude" :longitude="longitude" :markers="markers"
      :show-location="true"></map>

    <!-- 悬浮功能框 -->
    <view class="detail-card-wrap">
      <view class="detail-card">

        <!-- 设备头部信息 -->
        <view class="device-header flex align-center">
          <image src="/static/images/equip/equip.png" class="device-img margin-right" mode="aspectFit"></image>
          <view class="device-info">
            <view class="text-32 text-bold margin-bottom-xs">{{ device.name || '设备名称' }}</view>
            <view class="text-xs margin-bottom-xs">设备序列号：{{ device.imei || '55666323' }}</view>
            <view class="text-xs">当前位置：{{ device.location || '二七区嵩山南路交叉口万象城' }}</view>
          </view>
        </view>

        <!-- 状态列表 -->
        <view class="status-list ">
          <view class="status-item flex justify-between align-center padding-bottom">
            <text class="text-28">状态：</text>
            <text class="text-28 text-green">在线</text>
          </view>
          <view class="status-item flex justify-between align-center padding-tb-20">
            <text class="text-28">电量：</text>
            <text class="text-28">90%</text>
          </view>
          <view class="status-item flex justify-between align-center padding-tb-20">
            <text class="text-28">最后位置：</text>
            <text class="text-28">1分钟前</text>
          </view>
          <view class="status-item flex justify-between align-center padding-tb-20">
            <text class="text-28">位置上传间隔：</text>
            <view class="flex align-center" @tap="openIntervalPopup">
              <text class="text-28">{{ selectedInterval }}</text>
              <image src="/static/images/trangile.png" style="width: 28rpx; height: 15rpx;" class="margin-left-xs"
                mode="aspectFit"></image>
            </view>
          </view>
        </view>

        <!-- 功能按钮网格 -->
        <view class="action-grid margin-top-sm">
          <view class="grid action-grid-content">
            <view
              class="action-item-wrap flex flex-direction align-center justify-center  box-size-w-157 box-size-h-97 "
              v-for="(item, index) in actionList" :key="index" @tap="handleAction(item)">
              <view class="padding-tb-4">
                <image :src="item.icon" style="width: 76rpx; height: 76rpx;" mode="aspectFit"></image>
              </view>
              <view class="padding-tb-4">
                <text class="action-name text-action-color">{{ item.name }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 位置上传间隔设置弹窗 -->
    <up-popup :show="showIntervalPopup" round="20rpx" mode="center" @close="cancelInterval">
      <view class="interval-popup-content">
        <view class="text-32 text-center margin-bottom">位置上传间隔</view>
        
        <view class="interval-grid margin-bottom">
          <view 
            v-for="(item, index) in intervalOptions" 
            :key="index"
            class="interval-item flex align-center justify-center border"
            :class="{ 'interval-item-active': tempInterval === item }"
            @tap="selectInterval(item)"
          >
            <text class="interval-text" :class="{ 'interval-text-active': tempInterval === item }">{{ item }}</text>
          </view>
        </view>
        
        <view class="flex justify-between gap-20 ">
					<view class="flex-sub padding-tb-24 text-center radius-120 bg-white border" @tap="cancelInterval">取消</view>
			
					<view class="flex-sub padding-tb-24  text-center radius-120 text-white bg-df-color" @tap="saveInterval">确认设置</view>
        </view>
      </view>
    </up-popup>

    <!-- 电子围栏设置弹窗 -->
    <up-popup :show="showFencePopup" round="20rpx" mode="center" @close="cancelFence">
      <view class="fence-popup-content">
        <view class="text-32  text-center margin-bottom">设置电子围栏</view>

        <view class="fence-map-wrap margin-bottom">
          <map class="fence-map" :latitude="latitude" :longitude="longitude" :circles="tempFenceCircles"
            :markers="markers"></map>
        </view>

        <view class="flex justify-between align-center margin-bottom-sm">
          <text class="text-28">围栏半径：</text>
          <text class="text-28 text-bold text-primary">{{ tempFenceRadius }}米</text>
        </view>

        <view class="margin-bottom slider-wrap">

          <slider :value="tempFenceRadius" @changing="e => tempFenceRadius = e.detail.value"
            @change="e => tempFenceRadius = e.detail.value" :min="20" :max="2500" :step="10" activeColor="#5D4037"
            backgroundColor="#E0E0E0" block-color="#5D4037" block-size="20" style="margin: 0;" />
        </view>

        <view class="margin-bottom">
          <text class="text-28 " style="color: #404348;">围栏中心：</text>
          <view class="text-28  margin-top-xs" style="color: #000000;">{{ device.location || '二七区嵩山南路交叉口万象城' }}</view>
        </view>

        <view class="flex justify-between gap-20">
          <view class="flex-sub padding-tb-24 text-center radius-120 border" @tap="cancelFence">取消</view>
          <view class="flex-sub padding-tb-24 text-center radius-120 text-white bg-df-color" @tap="saveFence">确认设置</view>
        </view>
      </view>
    </up-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { toPath } from '@/common/utils/util.js';

const device = ref({});
const latitude = ref(34.7466);
const longitude = ref(113.6253);
const markers = ref([{
  id: 1,
  latitude: 34.7466,
  longitude: 113.6253,
  iconPath: '/static/images/location.png',
  width: 40,
  height: 40
}]);

// 位置上传间隔相关逻辑
const showIntervalPopup = ref(false);
const selectedInterval = ref('1分钟');
const tempInterval = ref('1分钟'); // 临时变量存储选择
const intervalOptions = ['5分钟', '15分钟', '30分钟', '1小时', '3小时', '12小时'];

const openIntervalPopup = () => {
  tempInterval.value = selectedInterval.value; // 打开时同步当前值
  showIntervalPopup.value = true;
};

const selectInterval = (item) => {
  tempInterval.value = item;
};

const saveInterval = () => {
  selectedInterval.value = tempInterval.value; // 确认时才保存
  uni.showToast({
    title: '设置成功',
    icon: 'success'
  });
  showIntervalPopup.value = false;
};

const cancelInterval = () => {
  tempInterval.value = selectedInterval.value; // 取消时恢复原值
  showIntervalPopup.value = false;
};

// 电子围栏相关逻辑
const showFencePopup = ref(false);
const fenceRadius = ref(200);
const tempFenceRadius = ref(200); // 临时变量

const fenceCircles = computed(() => [{
  latitude: latitude.value,
  longitude: longitude.value,
  radius: fenceRadius.value,
  color: '#5D403733', // 褐色半透明
  fillColor: '#5D403733',
  strokeWidth: 2
}]);

const tempFenceCircles = computed(() => [{
  latitude: latitude.value,
  longitude: longitude.value,
  radius: tempFenceRadius.value,
  color: '#5D403733',
  fillColor: '#5D403733',
  strokeWidth: 2
}]);

const openFencePopup = () => {
  tempFenceRadius.value = fenceRadius.value; // 打开时同步当前值
  showFencePopup.value = true;
};

const saveFence = () => {
  fenceRadius.value = tempFenceRadius.value; // 确认时才保存
  uni.showToast({
    title: '围栏设置成功',
    icon: 'success'
  });
  showFencePopup.value = false;
};

const cancelFence = () => {
  tempFenceRadius.value = fenceRadius.value; // 取消时恢复原值
  showFencePopup.value = false;
};

const actionList = [
  { name: '播放声音', icon: '/static/images/play-voice.png', url: '/pages/views/device/voice/index' },
  { name: '历史轨迹', icon: '/static/images/history-path.png', url: '/pages/views/device/history/index' },
  { name: '设置电子围栏', icon: '/static/images/edit-pen.png', type: 'popup' },
  { name: '开机关机', icon: '/static/images/start-shutdown.png', url: '/pages/views/device/power/index' }
];

const handleAction = (item) => {
  if (item.type === 'popup') {
    openFencePopup(); // 打开时初始化临时变量
    return;
  }
  if (item.url) {
    toPath(`${item.url}?id=${device.value.id || ''}&name=${device.value.name || ''}`);
  }
};

onLoad((options) => {
  if (options.id) {
    const storedDevices = uni.getStorageSync('deviceList') || [];
    const found = storedDevices.find(d => d.id == options.id);
    if (found) {
      device.value = found;
    }
  }
});
</script>

<style lang="scss" scoped>
	.radius-120{
		border-radius: 120rpx;
	}
	
	.padding-lr-126{
		padding-left: 126rpx;
		padding-right: 126rpx;
	}
	.padding-lr-120{
		padding-left: 120rpx;
		padding-right: 120rpx;
	}
	
.text-action-color {
  color: #201D1D;
}

.page-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.map-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.detail-card-wrap {
  position: absolute;
  bottom: 44rpx;
  left: 24rpx;
  right: 24rpx;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.detail-card {
  width: 702rpx;
  // height: 968rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50rpx 50rpx 50rpx 50rpx;
  border: 2rpx solid #FFFFFF;
  // padding: 40rpx;
  padding: 20rpx;
  backdrop-filter: blur(10px);
  padding-bottom: 42rpx;
}

.device-header {
  padding: 30rpx 0;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.08);

  .device-img {
    width: 160rpx;
    height: 120rpx;
  }

  .device-info {
    flex: 1;
  }
}

.status-list {
  margin-top: 34rpx;
}

.status-item {
  .text-green {
    color: #4cd964;
  }
}


.action-item-wrap {
  box-shadow: 0rpx 0rpx 6rpx 0rpx rgba(0, 0, 0, 0.05);
  border-radius: 42rpx 42rpx 42rpx 42rpx;
}

.action-grid-content {
  justify-content: center;
  gap: 22rpx 26rpx;
}

/* 位置上传间隔弹窗样式 */
.interval-popup-content {
  width: 676rpx;
  height: 510rpx;
  padding: 40rpx;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  border: 2rpx solid #FFFFFF;
  box-sizing: border-box;
	
	
backdrop-filter: blur(10px);
}

.interval-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.interval-item {
  width: 196rpx;
  height: 96rpx;
  background: #FFFFFF;
  border-radius: 30rpx 30rpx 30rpx 30rpx;
  cursor: pointer;
}

.interval-item-active {
  width: 196rpx;
  height: 96rpx;
  background: #4E1200;
  border-radius: 30rpx 30rpx 30rpx 30rpx;
  border: 2rpx solid #4E1200;
}

.interval-text {
  font-size: 28rpx;
  color: #333333;
}

.interval-text-active {
  color: #FFFFFF;
}

/* 电子围栏弹窗样式 */
.fence-popup-content {
  width: 680rpx;
  padding: 40rpx;
  // background-color: #fff;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  border: 2rpx solid #FFFFFF;
	
backdrop-filter: blur(10px);
}

.slider-wrap {

  width: 100%;


}

.fence-map-wrap {
  width: 100%;
  height: 400rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.fence-map {
  width: 100%;
  height: 100%;
}

.text-primary {
  color: #4E1200;
}

.bg-primary {
  background-color: #5D4037;
}

.gap-20 {
  gap: 20rpx;
}

.line-gray {
  border: 1rpx solid #ddd;
  background-color: transparent;
}

// .action-item-wrap {
//   .action-item {
//     // box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
//     height: 180rpx;

//     .action-icon {
//       // width: 60rpx;
//       // height: 60rpx;
//     }
//   }

</style>
