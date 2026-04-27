# cu-notice-bar 滚动通知组件

## 介绍
一个功能完整的滚动通知组件，支持水平和垂直两个方向的滚动，可自定义滚动内容和样式，支持左右两侧自定义图标。

## 引入

```js
import CuNoticeBar from '@/components/cu-components/cu-notice-bar/cu-notice-bar.vue'
```

## 代码演示

### 基础用法

```vue
<template>
  <cu-notice-bar :noticeList="noticeList" />
</template>

<script setup>
const noticeList = [
  { text: '这是第一条通知' },
  { text: '这是第二条通知' },
  { text: '这是第三条通知' }
];
</script>
```

### 垂直滚动

```vue
<template>
  <cu-notice-bar 
    direction="vertical" 
    :noticeList="noticeList"
    @click="handleNoticeClick"
  />
</template>

<script setup>
function handleNoticeClick({ item, index }) {
  //console.log('点击通知:', item, index);
}
</script>
```

### 自定义样式

```vue
<template>
  <cu-notice-bar
    :noticeList="noticeList"
    :barStyle="{ 
      background: '#f0f0f0',
      height: '100rpx'
    }"
    :itemStyle="{
      color: '#333',
      fontSize: '32rpx'
    }"
  />
</template>
```

### 自定义图标

```vue
<template>
  <cu-notice-bar :noticeList="noticeList">
    <!-- 自定义左侧图标 -->
    <template #leftIcon>
      <image src="/static/notice.png" mode="aspectFit" />
    </template>
    
    <!-- 自定义右侧图标 -->
    <template #rightIcon>
      <text class="cuIcon-more"></text>
    </template>
  </cu-notice-bar>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| noticeList | 通知列表数据 | Array | [] |
| direction | 滚动方向，可选值：horizontal/vertical | String | 'horizontal' |
| speed | 滚动速度，单位px/s | Number | 50 |
| interval | 滚动间隔时间，单位ms | Number | 3000 |
| itemStyle | 滚动项样式 | Object | {} |
| barStyle | 通知栏样式 | Object | {} |
| showLeftIcon | 是否显示左侧默认图标 | Boolean | true |
| showRightIcon | 是否显示右侧默认图标 | Boolean | true |

### NoticeList 数据结构

```ts
interface NoticeItem {
  text: string;      // 通知文本
  [key: string]: any // 其他自定义字段
}
```

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击通知项时触发 | { item: NoticeItem, index: number } |
| close | 点击关闭按钮时触发 | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| leftIcon | 自定义左侧图标 |
| rightIcon | 自定义右侧图标 |

### 样式变量

组件提供了以下样式变量，可用于自定义样式：

```scss
// 通知栏默认样式
background: #FFF7EB;
height: 80rpx;

// 图标默认样式
font-size: 36rpx;
color: #FF9900;

// 文本默认样式
color: #FF9900;
font-size: 28rpx;
```

## 注意事项

1. 水平滚动使用 requestAnimationFrame 实现平滑滚动效果
2. 垂直滚动使用 uni-app 的 swiper 组件实现
3. 组件会在销毁时自动清理定时器，防止内存泄漏
4. 通知栏高度可以通过 barStyle 属性自定义
5. 滚动速度和间隔时间可以根据实际需求调整
6. 支持通过插槽完全自定义左右两侧的图标内容

## 常见问题

### 1. 如何调整滚动速度？

可以通过 speed 属性调整水平滚动的速度，通过 interval 属性调整垂直滚动的切换间隔：

```vue
<cu-notice-bar 
  :speed="100"
  :interval="2000"
  :noticeList="noticeList"
/>
```

### 2. 如何隐藏图标？

可以通过设置 showLeftIcon 和 showRightIcon 属性来控制默认图标的显示：

```vue
<cu-notice-bar
  :showLeftIcon="false"
  :showRightIcon="false"
  :noticeList="noticeList"
/>
```

### 3. 如何自定义样式？

组件提供了 barStyle 和 itemStyle 两个属性来自定义样式：

```vue
<cu-notice-bar
  :barStyle="{
    background: '#f5f5f5',
    height: '100rpx',
    borderRadius: '8rpx'
  }"
  :itemStyle="{
    color: '#333',
    fontSize: '32rpx',
    fontWeight: 'bold'
  }"
  :noticeList="noticeList"
/>
``` 