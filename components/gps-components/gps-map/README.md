# gps-map 地图封装组件

基于 `uni-app` 原生 `map` 组件封装的增强型地图组件，适用于 GPS 定位、轨迹回放、电子围栏等场景。

## 目录结构
```text
gps-map/
├── gps-map.vue          # 组件主体
└── coord-transform.js   # 坐标转换工具 (WGS84/GCJ02/BD09)
```

## 核心特性
1. **多端兼容**: 支持 App (Android/iOS)、微信小程序、H5 等。
2. **围栏支持**: 通过 `circles` 和 `polygons` 属性支持圆形和多边形围栏展示。
3. **坐标转换**: 内置火星坐标(GCJ-02)、百度坐标(BD-09)与地球坐标(WGS-84)互转工具。
4. **自定义气泡**: 支持原生 `callout` 并在 `gps-map.vue` 中封装了点击事件。
5. **动态交互**: 提供 `translateMarker` (平滑移动)、`includePoints` (自动缩放视野) 等常用方法。
6. **扩展插槽**: 提供默认插槽用于在地图上方叠加 UI，提供 `controls` 插槽用于地图原生控件。

## 进阶用法：配合 gps-panel 浮窗

`gps-map` 提供了一个默认插槽，非常适合放置 `gps-panel` 组件，实现类似打车软件的底部信息交互。

```vue
<template>
  <view class="page">
    <gps-map :latitude="34.7" :longitude="113.6">
      <!-- 放置浮窗 -->
      <gps-panel v-model="isExpand" title="设备状态详情">
        <view class="content">
          <text>这里是详细的设备信息内容...</text>
          <text>支持滚动查看更多内容。</text>
        </view>
      </gps-panel>
    </gps-map>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import GpsMap from '@/components/gps-components/gps-map/gps-map.vue';
import GpsPanel from '@/components/gps-components/gps-panel/gps-panel.vue';

const isExpand = ref(false);
</script>
```

## API 说明

### Props
| 参数 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| mapId | String | `gpsMap` | 地图唯一ID |
| latitude | Number | `34.7466` | 中心点纬度 |
| longitude | Number | `113.6253` | 中心点经度 |
| scale | Number | `14` | 缩放级别 |
| markers | Array | `[]` | 标记点列表 |
| polyline | Array | `[]` | 路线列表 |
| circles | Array | `[]` | 圆形(围栏)列表 |
| polygons | Array | `[]` | 多边形(围栏)列表 |
| showLocation | Boolean | `true` | 是否显示当前定位点 |

### Methods (通过 ref 调用)
| 方法名 | 参数 | 说明 |
| :--- | :--- | :--- |
| moveToLocation | - | 移动到当前定位点 |
| includePoints | `(points, padding)` | 缩放视野以包含所有点 |
| translateMarker | `(id, dest, duration)` | 平滑移动标记点 |
| getRegion | - | 获取当前视野范围 |

### Events
| 事件名 | 说明 |
| :--- | :--- |
| @tap | 点击地图 |
| @markertap | 点击标记点 |
| @callouttap | 点击气泡 |
| @regionchange | 视野变化 |

## 坐标转换工具用法
```javascript
import { wgs84togcj02 } from './coord-transform.js';

// 将 GPS 原始坐标转换为高德/腾讯/uni-app 使用的火星坐标
const [gcjLng, gcjLat] = wgs84togcj02(113.6253, 34.7466);
```
