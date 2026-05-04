<template>
  <view class="page-wrap">
    <!-- 顶部导航栏 -->
    <cu-nav-bar title-text="我的设备" :isBack="true" color="#000" />

    <!-- 
      ========================================
      GPS 地图组件 (gps-map)
      ========================================
      使用 skill 提供的 gps-map 组件替换原生 map 组件
      优势：
      1. 封装了常用的地图操作方法（moveToLocation、translateMarker、includePoints 等）
      2. 支持标记点、轨迹线、圆形/多边形围栏
      3. 默认使用 GCJ-02 (火星坐标系)
      
      组件路径：components/gps-components/gps-map/gps-map.vue
    -->
    <gps-map
      ref="mapRef"
      class="map-bg"
      :latitude="latitude"
      :longitude="longitude"
      :markers="markers"
      :circles="fenceCircles"
      :show-location="true"
      :scale="15"
      @markertap="onMarkerTap"
    />

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
          <!-- 
            ========================================
            围栏弹窗中的地图也使用 gps-map 组件
            ========================================
          -->
          <gps-map
            ref="fenceMapRef"
            class="fence-map"
            :latitude="deviceLat"
            :longitude="deviceLng"
            :markers="markers"
            :circles="tempFenceCircles"
            :scale="15"
            :show-location="false"
          />
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

/**
 * ========================================
 * 引入 gps-map 组件
 * ========================================
 * 组件路径：components/gps-components/gps-map/gps-map.vue
 * 该组件基于 uni-app 原生 map 封装，提供了更便捷的 API 调用方式
 */
import GpsMap from '@/components/gps-components/gps-map/gps-map.vue';

/**
 * ========================================
 * 引入 API 请求模块（示例）
 * ========================================
 * 项目使用 uview-plus 的 http 进行网络请求
 * 请求配置在：common/api/index.js
 * 接口地址定义在：common/api/urls.js
 * 
 * 后续如需调用设备相关接口，建议：
 * 1. 在 common/api/modules/ 下创建 device.js 模块
 * 2. 在 common/api/index.js 中统一导出
 * 3. 在页面中按需导入使用
 */
// import { getDeviceDetail, getDeviceLocation, updateDeviceInterval } from '@/common/api/modules/device.js';

const device = ref({});
const latitude = ref(34.7466); // 地图中心维度
const longitude = ref(113.6253); // 地图中心经度
const markers = ref([]);

// gps-map 组件引用，用于调用组件内部方法
const mapRef = ref(null);
const fenceMapRef = ref(null);

// 设备真实位置（用于标记和围栏圆心）
const deviceLat = ref(34.7466);
const deviceLng = ref(113.6253);

// 模拟数据列表，用于详情页直接访问时的兜底
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

/**
 * ========================================
 * 保存位置上传间隔设置（API 调用示例）
 * ========================================
 * 后续接入真实接口时的调用方式：
 * 
 * const saveInterval = async () => {
 *   try {
 *     uni.showLoading({ title: '设置中...' });
 *     
 *     // 调用 API 接口
 *     const res = await updateDeviceInterval({
 *       deviceId: device.value.id,
 *       interval: tempInterval.value
 *     });
 *     
 *     if (res.code === 1) {
 *       selectedInterval.value = tempInterval.value;
 *       uni.showToast({ title: '设置成功', icon: 'success' });
 *     } else {
 *       uni.showToast({ title: res.msg || '设置失败', icon: 'none' });
 *     }
 *   } catch (error) {
 *     console.error('设置间隔失败:', error);
 *     uni.showToast({ title: '网络错误', icon: 'none' });
 *   } finally {
 *     uni.hideLoading();
 *     showIntervalPopup.value = false;
 *   }
 * };
 */
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

// 围栏圆形数据，用于 gps-map 组件的 circles 属性
const fenceCircles = computed(() => [{
  latitude: deviceLat.value,
  longitude: deviceLng.value,
  radius: fenceRadius.value,
  color: '#5D403733', // 褐色半透明
  fillColor: '#5D403733',
  strokeWidth: 2
}]);

const tempFenceCircles = computed(() => [{
  latitude: deviceLat.value,
  longitude: deviceLng.value,
  radius: tempFenceRadius.value,
  color: '#5D403733',
  fillColor: '#5D403733',
  strokeWidth: 2
}]);

const openFencePopup = () => {
  tempFenceRadius.value = fenceRadius.value; // 打开时同步当前值
  showFencePopup.value = true;
};

/**
 * ========================================
 * 保存电子围栏设置（API 调用示例）
 * ========================================
 * 后续接入真实接口时的调用方式：
 * 
 * const saveFence = async () => {
 *   try {
 *     uni.showLoading({ title: '保存中...' });
 *     
 *     // 调用 API 接口保存围栏设置
 *     const res = await saveDeviceFence({
 *       deviceId: device.value.id,
 *       centerLat: deviceLat.value,
 *       centerLng: deviceLng.value,
 *       radius: tempFenceRadius.value
 *     });
 *     
 *     if (res.code === 1) {
 *       fenceRadius.value = tempFenceRadius.value;
 *       uni.showToast({ title: '围栏设置成功', icon: 'success' });
 *     } else {
 *       uni.showToast({ title: res.msg || '设置失败', icon: 'none' });
 *     }
 *   } catch (error) {
 *     console.error('保存围栏失败:', error);
 *     uni.showToast({ title: '网络错误', icon: 'none' });
 *   } finally {
 *     uni.hideLoading();
 *     showFencePopup.value = false;
 *   }
 * };
 */
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

const actionList = computed(() => [
  { name: '播放声音', icon: '/static/images/play-voice.png', action: 'playVoice' },
  { name: '历史轨迹', icon: '/static/images/history-path.png', url: '/pages/views/device/history/index' },
  { name: '设置电子围栏', icon: '/static/images/edit-pen.png', type: 'popup' },
  { name: device.value.powerStatus === 'off' ? '开机' : '关机', icon: '/static/images/start-shutdown.png', action: 'powerControl' }
]);

const handleAction = (item) => {
  if (item.type === 'popup') {
    openFencePopup(); // 打开时初始化临时变量
    return;
  }
  if (item.action === 'playVoice') {
    handlePlayVoice();
    return;
  }
  if (item.action === 'powerControl') {
    handlePowerControl();
    return;
  }
  if (item.url) {
    toPath(`${item.url}?id=${device.value.id || ''}&name=${device.value.name || ''}`);
  }
};

/**
 * @description 播放声音 - 调用设备接口
 */
const handlePlayVoice = () => {
  uni.showModal({
    title: '提示',
    content: `确定要让设备 "${device.value.name || ''}" 播放声音吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用播放声音接口
        // playDeviceVoice({ deviceId: device.value.id })
        uni.showLoading({ title: '发送指令中...' });
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({ title: '指令已发送', icon: 'success' });
        }, 1000);
      }
    }
  });
};

/**
 * @description 开机关机 - 调用设备接口
 */
const handlePowerControl = () => {
  const isPowerOff = device.value.powerStatus === 'off';
  const actionText = isPowerOff ? '开机' : '关机';
  const nextStatus = isPowerOff ? 'on' : 'off';
  
  uni.showModal({
    title: '提示',
    content: `确定要${actionText}设备 "${device.value.name || ''}" 吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用开机关机接口
        // controlDevicePower({ deviceId: device.value.id, action: nextStatus })
        uni.showLoading({ title: '发送指令中...' });
        setTimeout(() => {
          uni.hideLoading();
          // 模拟切换状态
          device.value.powerStatus = nextStatus;
          uni.showToast({ title: `${actionText}指令已发送`, icon: 'success' });
        }, 1000);
      }
    }
  });
};

/**
 * 点击地图标记点事件
 * @param {Object} detail - 标记点信息
 */
const onMarkerTap = (detail) => {
  console.log('点击了标记点:', detail);
  // 可以在这里实现点击标记点后的交互，如显示设备详情弹窗等
};

/**
 * ========================================
 * 获取设备详情（API 调用示例）
 * ========================================
 * 后续接入真实接口时的调用方式：
 * 
 * const fetchDeviceDetail = async (deviceId) => {
 *   try {
 *     uni.showLoading({ title: '加载中...' });
 *     
 *     // 调用 API 接口获取设备详情
 *     const res = await getDeviceDetail({ deviceId });
 *     
 *     if (res.code === 1 && res.data) {
 *       const data = res.data;
 *       device.value = data;
 *       
 *       // 更新地图中心点和标记
 *       const lat = parseFloat(data.latitude);
 *       const lng = parseFloat(data.longitude);
 *       
 *       if (!isNaN(lat) && !isNaN(lng)) {
 *         deviceLat.value = lat;
 *         deviceLng.value = lng;
 *         latitude.value = lat - 0.012; // 偏移使标记点在屏幕上方
 *         longitude.value = lng;
 *         
 *         markers.value = [{
 *           id: Number(data.id),
 *           latitude: lat,
 *           longitude: lng,
 *           iconPath: '/static/images/location.png',
 *           width: 40,
 *           height: 40
 *         }];
 *         
 *         // 使用 gps-map 组件的方法移动地图视角
 *         setTimeout(() => {
 *           if (mapRef.value) {
 *             mapRef.value.moveToLocation();
 *           }
 *         }, 300);
 *       }
 *     } else {
 *       uni.showToast({ title: res.msg || '获取设备信息失败', icon: 'none' });
 *     }
 *   } catch (error) {
 *     console.error('获取设备详情失败:', error);
 *     uni.showToast({ title: '网络错误', icon: 'none' });
 *   } finally {
 *     uni.hideLoading();
 *   }
 * };
 */

/**
 * ========================================
 * 获取设备实时位置（API 调用示例）
 * ========================================
 * 用于定时刷新设备位置：
 * 
 * const fetchDeviceLocation = async (deviceId) => {
 *   try {
 *     const res = await getDeviceLocation({ deviceId });
 *     
 *     if (res.code === 1 && res.data) {
 *       const { latitude, longitude } = res.data;
 *       
 *       // 更新设备位置标记
 *       if (mapRef.value) {
 *         // 使用 translateMarker 实现平滑移动动画
 *         mapRef.value.translateMarker({
 *           markerId: Number(deviceId),
 *           destination: {
 *             latitude: parseFloat(latitude),
 *             longitude: parseFloat(longitude)
 *           },
 *           duration: 1000
 *         });
 *       }
 *     }
 *   } catch (error) {
 *     console.error('获取设备位置失败:', error);
 *   }
 * };
 * 
 * // 定时刷新（每 30 秒）
 * let locationTimer = null;
 * const startLocationRefresh = (deviceId) => {
 *   locationTimer = setInterval(() => {
 *     fetchDeviceLocation(deviceId);
 *   }, 30000);
 * };
 * 
 * const stopLocationRefresh = () => {
 *   if (locationTimer) {
 *     clearInterval(locationTimer);
 *     locationTimer = null;
 *   }
 * };
 * 
 * // 在 onUnload 中清理定时器
 * onUnload(() => {
 *   stopLocationRefresh();
 * });
 */

onLoad((options) => {
  if (options.id) {
    /**
     * ========================================
     * 实际项目中，这里应该调用 API 获取设备详情
     * ========================================
     * 示例：fetchDeviceDetail(options.id);
     * 
     * 当前使用本地缓存和模拟数据作为兜底
     */
    
    // 优先从本地缓存获取
    const storedDevices = uni.getStorageSync('deviceList') || [];
    let found = storedDevices.find(d => d.id == options.id);
    
    // 如果本地缓存没有，从模拟数据列表找（兼容直接刷新页面等场景）
    if (!found) {
      found = mockDevices.find(d => d.id == options.id);
    }

    if (found) {
      device.value = found;
      
      // 初始化 powerStatus，如果没有则默认为 'on'
      if (!device.value.powerStatus) {
        device.value.powerStatus = 'on';
      }
      
      // 安全获取经纬度，确保是有效的数字
      const lat = parseFloat(found.latitude);
      const lng = parseFloat(found.longitude);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        // 更新设备真实坐标
        deviceLat.value = lat;
        deviceLng.value = lng;

        // 设置地图中心点（应用偏移量，使标记点显示在屏幕中心偏上区域）
        // 偏移量从 0.012 减小到 0.006，让设备图标往下移动一点
        latitude.value = lat - 0.009;
        longitude.value = lng;

        // 设置设备标记点
        markers.value = [{
          id: Number(found.id),
          latitude: lat,
          longitude: lng,
          iconPath: '/static/images/location.png',
          width: 40,
          height: 40
        }];
        
        /**
         * ========================================
         * 使用 gps-map 组件的方法移动地图视角
         * ========================================
         * 将地图中心移动到偏移后的位置，使设备标记显示在屏幕上方中心区域
         */
        setTimeout(() => {
          if (mapRef.value) {
            // 移动到偏移后的中心点（使标记显示在屏幕上方）
            mapRef.value.moveToLocation(latitude.value, longitude.value);
          }
        }, 300);
      } else {
        console.error('设备经纬度无效:', found);
        // 如果经纬度无效，保持默认值（万象城）
        deviceLat.value = 34.7466;
        deviceLng.value = 113.6253;
        // 偏移量从 0.012 减小到 0.006，让设备图标往下移动一点
        latitude.value = 34.7466 - 0.006;
        longitude.value = 113.6253;

        markers.value = [{
          id: Number(found.id),
          latitude: deviceLat.value,
          longitude: deviceLng.value,
          iconPath: '/static/images/location.png',
          width: 40,
          height: 40
        }];
        
        setTimeout(() => {
          if (mapRef.value) {
            // 移动到偏移后的中心点（使标记显示在屏幕上方）
            mapRef.value.moveToLocation(latitude.value, longitude.value);
          }
        }, 300);
      }
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

/**
 * ========================================
 * gps-map 组件样式
 * ========================================
 * 使用 gps-map 组件后，样式类名保持不变
 * 组件内部已经处理了宽高和定位
 */
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

</style>