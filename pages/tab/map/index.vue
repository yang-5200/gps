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

const latitude = ref(34.7466);
const longitude = ref(113.6253);
const markers = ref([]);
const deviceList = ref([]);

// 模拟数据列表
const mockDevices = [
  { 
    id: 1, 
    imei: '55666321', 
    name: '郑州火车站设备', 
    status: '在线', 
    latitude: 34.7486,
    longitude: 113.6585,
    location: '郑州二七广场火车站'
  },
  { 
    id: 2, 
    imei: '55666322', 
    name: '洛阳火车站设备', 
    status: '在线', 
    latitude: 34.6853,
    longitude: 112.4342,
    location: '洛阳火车站'
  },
  { 
    id: 3, 
    imei: '55666323', 
    name: '万象城设备', 
    status: '在线', 
    latitude: 34.7466,
    longitude: 113.6253,
    location: '二七区嵩山南路交叉口万象城'
  }
];

const initMap = () => {
  const storedDevices = uni.getStorageSync('deviceList') || mockDevices;
  deviceList.value = storedDevices;
  
  if (storedDevices.length > 0) {
    const validMarkers = [];
    let firstValidCoord = null;

    storedDevices.forEach(device => {
      const lat = parseFloat(device.latitude);
      const lng = parseFloat(device.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        if (!firstValidCoord) {
          firstValidCoord = { lat, lng };
        }
        validMarkers.push({
          id: Number(device.id),
          latitude: lat,
          longitude: lng,
          title: device.name,
          iconPath: '/static/images/location.png',
          width: 40,
          height: 40,
          callout: {
            content: device.name,
            display: 'ALWAYS',
            padding: 4,
            borderRadius: 4
          }
        });
      }
    });

    markers.value = validMarkers;
    
    if (firstValidCoord) {
      latitude.value = firstValidCoord.lat;
      longitude.value = firstValidCoord.lng;
    }
  }
};

onLoad((options) => {
  console.log('地图页面加载', options);
  initMap();
});
</script>

<style lang="scss">
.page-wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

  .page-content {
    width: 100%;
    height: 100%;
    position: relative;

    .map-container {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    .map {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
