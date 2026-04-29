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
            <view class="flex align-center">
              <text class="text-28">1分钟</text>
              <!-- 这个问ui要三角形切图 -->
              <image src="/static/images/trangile.png" style="width: 48rpx; height: 48rpx;" class="margin-left-xs"
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

    <!-- 电子围栏设置弹窗 -->
    <up-popup :show="showFencePopup" round="20rpx" mode="center" @close="showFencePopup = false">
      <view class="fence-popup-content">
        <view class="text-32  text-center margin-bottom">设置电子围栏</view>

        <view class="fence-map-wrap margin-bottom">
          <map class="fence-map" :latitude="latitude" :longitude="longitude" :circles="fenceCircles"
            :markers="markers"></map>
        </view>

        <view class="flex justify-between align-center margin-bottom-sm">
          <text class="text-28">围栏半径：</text>
          <text class="text-28 text-bold text-primary">{{ fenceRadius }}米</text>
        </view>

        <view class="margin-bottom slider-wrap">

          <slider :value="fenceRadius" @changing="e => fenceRadius = e.detail.value"
            @change="e => fenceRadius = e.detail.value" :min="20" :max="2500" :step="10" activeColor="#5D4037"
            backgroundColor="#E0E0E0" block-color="#5D4037" block-size="20" style="margin: 0;" />
        </view>

        <view class="margin-bottom">
          <text class="text-28 " style="color: #404348;">围栏中心：</text>
          <view class="text-28  margin-top-xs" style="color: #000000;">{{ device.location || '二七区嵩山南路交叉口万象城' }}</view>
        </view>

        <view class="flex justify-between gap-20">
          <button class="flex-1 cu-btn round line-gray" @tap="showFencePopup = false">取消</button>
          <button class="flex-1 cu-btn round bg-primary text-white" @tap="saveFence">确认设置</button>
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

// 电子围栏相关逻辑
const showFencePopup = ref(false);
const fenceRadius = ref(200);
const fenceCircles = computed(() => [{
  latitude: latitude.value,
  longitude: longitude.value,
  radius: fenceRadius.value,
  color: '#5D403733', // 褐色半透明
  fillColor: '#5D403733',
  strokeWidth: 2
}]);

const saveFence = () => {
  uni.showToast({
    title: '围栏设置成功',
    icon: 'success'
  });
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
    showFencePopup.value = true;
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

/* 电子围栏弹窗样式 */
.fence-popup-content {
  width: 680rpx;
  padding: 40rpx;
  // background-color: #fff;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32rpx 32rpx 32rpx 32rpx;
  border: 2rpx solid #FFFFFF;
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
// }</style>
