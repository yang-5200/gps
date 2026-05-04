<template>
  <view class="gps-map-container">
    <map
      :id="mapId"
      class="gps-map"
      :latitude="latitude"
      :longitude="longitude"
      :scale="scale"
      :markers="markers"
      :polyline="polyline"
      :circles="circles"
      :polygons="polygons"
      :show-location="showLocation"
      :enable-3D="enable3D"
      :show-compass="showCompass"
      :enable-overlooking="enableOverlooking"
      :enable-zoom="enableZoom"
      :enable-scroll="enableScroll"
      :enable-rotate="enableRotate"
      :enable-satellite="enableSatellite"
      :enable-traffic="enableTraffic"
      @tap="onMapTap"
      @markertap="onMarkerTap"
      @callouttap="onCalloutTap"
      @controltap="onControlTap"
      @regionchange="onRegionChange"
      @updated="onMapUpdated"
      @anchorpointtap="onAnchorPointTap"
    >
      <!-- #ifdef APP-PLUS || MP-WEIXIN -->
      <cover-view class="map-controls" v-if="showControls">
        <slot name="controls"></slot>
      </cover-view>
      <!-- #endif -->
    </map>
    
    <!-- 附加功能插槽 -->
    <view class="gps-map-overlay">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
/**
 * gps-map 地图封装组件
 * 
 * @description 基于 uni-app 原生 map 组件封装，支持标记点、轨迹、围栏、交互事件等
 * @property {String} mapId 地图组件ID
 * @property {Number} latitude 中心点纬度
 * @property {Number} longitude 中心点经度
 * @property {Number} scale 缩放级别 (3-20)
 * @property {Array} markers 标记点列表
 * @property {Array} polyline 路线列表
 * @property {Array} circles 圆形(围栏)列表
 * @property {Array} polygons 多边形(围栏)列表
 * @property {Boolean} showLocation 是否显示带有方向的当前定位点
 * @property {Boolean} showControls 是否显示控制插槽
 * 
 * @event {Function} tap 点击地图时触发
 * @event {Function} markertap 点击标记点时触发
 * @event {Function} callouttap 点击标记点气泡时触发
 * @event {Function} regionchange 视野发生变化时触发
 */
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const props = defineProps({
  mapId: {
    type: String,
    default: 'gpsMap'
  },
  latitude: {
    type: [Number, String],
    default: 34.7466
  },
  longitude: {
    type: [Number, String],
    default: 113.6253
  },
  scale: {
    type: Number,
    default: 14
  },
  markers: {
    type: Array,
    default: () => []
  },
  polyline: {
    type: Array,
    default: () => []
  },
  circles: {
    type: Array,
    default: () => []
  },
  polygons: {
    type: Array,
    default: () => []
  },
  showLocation: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: false
  },
  enable3D: {
    type: Boolean,
    default: false
  },
  showCompass: {
    type: Boolean,
    default: false
  },
  enableOverlooking: {
    type: Boolean,
    default: false
  },
  enableZoom: {
    type: Boolean,
    default: true
  },
  enableScroll: {
    type: Boolean,
    default: true
  },
  enableRotate: {
    type: Boolean,
    default: false
  },
  enableSatellite: {
    type: Boolean,
    default: false
  },
  enableTraffic: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'tap', 
  'markertap', 
  'callouttap', 
  'controltap', 
  'regionchange', 
  'updated',
  'anchorpointtap'
]);

let mapContext = null;

onMounted(() => {
  mapContext = uni.createMapContext(props.mapId);
});

// --- 地图方法封装 ---

/**
 * 移动到指定位置
 * @param {Number} latitude - 纬度，不传则移动到当前定位点
 * @param {Number} longitude - 经度，不传则移动到当前定位点
 */
const moveToLocation = (latitude, longitude) => {
  if (mapContext) {
    const params = {};
    if (latitude !== undefined && longitude !== undefined) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    mapContext.moveToLocation(params);
  }
};

/**
 * 获取当前地图视野范围
 */
const getRegion = () => {
  return new Promise((resolve, reject) => {
    if (mapContext) {
      mapContext.getRegion({
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      });
    }
  });
};

/**
 * 获取当前地图缩放级别
 */
const getScale = () => {
  return new Promise((resolve, reject) => {
    if (mapContext) {
      mapContext.getScale({
        success: (res) => resolve(res),
        fail: (err) => reject(err)
      });
    }
  });
};

/**
 * 平移移动地图
 */
const translateMarker = (markerId, destination, duration = 1000) => {
  if (mapContext) {
    mapContext.translateMarker({
      markerId,
      destination,
      duration,
      animationEnd: () => {
        console.log('marker animation end');
      }
    });
  }
};

/**
 * 缩放视野以包含所有给定的坐标点
 */
const includePoints = (points, padding = [40, 40, 40, 40]) => {
  if (mapContext) {
    mapContext.includePoints({
      points,
      padding
    });
  }
};

// --- 事件处理 ---

const onMapTap = (e) => {
  emit('tap', e.detail);
};

const onMarkerTap = (e) => {
  emit('markertap', e.detail);
};

const onCalloutTap = (e) => {
  emit('callouttap', e.detail);
};

const onControlTap = (e) => {
  emit('controltap', e.detail);
};

const onRegionChange = (e) => {
  emit('regionchange', e.detail);
};

const onMapUpdated = (e) => {
  emit('updated', e.detail);
};

const onAnchorPointTap = (e) => {
  emit('anchorpointtap', e.detail);
};

// 暴露方法给父组件
defineExpose({
  mapContext,
  moveToLocation,
  getRegion,
  getScale,
  translateMarker,
  includePoints
});
</script>

<style lang="scss" scoped>
.gps-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  
  .gps-map {
    width: 100%;
    height: 100%;
  }
  
  .gps-map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; // 允许穿透点击到地图
    
    // 覆盖层内的内容如果需要交互，需自行设置 pointer-events: auto
    :deep(*) {
      pointer-events: auto;
    }
  }
  
  .map-controls {
    position: absolute;
    right: 20rpx;
    bottom: 40rpx;
    z-index: 10;
  }
}
</style>
