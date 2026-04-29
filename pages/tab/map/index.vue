<template>
  <!-- 顶部导航栏 -->
  <cu-nav-bar :isBack="false" title-text="实时定位" :background="navbarImmerse.navBar.backgroundColor"></cu-nav-bar>

  <view class="page-wrap">
    <view class="page-content">
      <!-- 地图区域 -->
      <view class="map-container w100">
        <map class="map w100 h100" :latitude="latitude" :longitude="longitude" :markers="markers" :scale="14"
          show-location></map>
      </view>

      <!-- 设备列表浮层 -->
      
    </view>

    <!-- 底部导航栏 -->
    <CustomTabBar current-name="map" />
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useNavbarImmerse } from '@/common/utils/useNavbarImmerse.js';
import { useTabBar } from '../components/useTabBar.js';
import CustomTabBar from '../components/custom-tab-bar/custom-tab-bar.vue';

// 隐藏原生 TabBar
useTabBar();

const { navbarImmerse } = useNavbarImmerse();

const latitude = ref(39.9042);
const longitude = ref(116.4074);
const currentDevice = ref(1);

const markers = ref([
  {
    id: 1,
    latitude: 39.9042,
    longitude: 116.4074,
    title: '设备1',
    iconPath: '/static/images/marker.png',
    width: 40,
    height: 40
  }
]);

const deviceList = reactive([
  {
    id: 1,
    name: '车载GPS-01',
    status: 'online',
    statusText: '在线',
    location: '北京市朝阳区xxx街道',
    updateTime: '2分钟前'
  },
  {
    id: 2,
    name: '宠物定位器',
    status: 'offline',
    statusText: '离线',
    location: '最后位置：北京市海淀区',
    updateTime: '1小时前'
  }
]);

/**
 * @description 选择设备
 * @param {Object} device - 设备信息
 */
function selectDevice(device) {
  currentDevice.value = device.id;
  latitude.value = device.latitude || 39.9042;
  longitude.value = device.longitude || 116.4074;
}

onLoad((options) => {
  console.log('地图页面加载', options);
});
</script>

<style lang="scss">
.page-wrap {
  .page-content {
    padding-bottom: calc(176rpx + env(safe-area-inset-bottom));

    .map-container {
      height: 600rpx;
    }

    .device-panel {
      min-height: 400rpx;

      .device-list {
        max-height: 400rpx;
      }

      .device-item {
        background-color: #f8f8f8;

        &.active {
          background-color: #f0e6e0;
          border: 2rpx solid #5D4037;
        }

        .device-status {
          &.online {
            color: #52c41a;
            background-color: #f6ffed;
          }

          &.offline {
            color: #999;
            background-color: #f5f5f5;
          }
        }
      }
    }
  }
}
</style>
