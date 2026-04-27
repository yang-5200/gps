# cu-image-preview 图片预览组件

## 介绍
一个支持自定义样式的图片预览组件，可用于图片列表展示、预览和删除等场景。支持单张图片和图片数组，支持指定列样式配置。

## 引入

```js
import CuImagePreview from '@/components/cu-components/cu-image-preview/cu-image-preview.vue'
```

## 代码演示

### 基础用法

```vue
<template>
  <!-- 单张图片 -->
  <cu-image-preview v-model="imageUrl" />
  
  <!-- 图片数组 -->
  <cu-image-preview v-model="imageList" />
</template>

<script setup>
const imageUrl = 'https://example.com/image.jpg';
const imageList = [
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
];
</script>
```

### 自定义样式

```vue
<template>
  <!-- 修改单个样式属性 -->
  <cu-image-preview
    v-model="imageList"
    :preview-style="{
      width: '200rpx'  // 只修改宽度，其他样式保持默认
    }"
  />
  
  <!-- 完全自定义样式 -->
  <cu-image-preview
    v-model="imageList"
    :preview-style="{
      width: '200rpx',
      height: '200rpx',
      margin: '10rpx',
      borderRadius: '16rpx'
    }"
  />
</template>
```

### 指定列样式

```vue
<template>
  <cu-image-preview
    v-model="imageList"
    :column-styles="{
      // 第1列样式
      1: {
        width: '300rpx',
        height: '300rpx',
        margin: '0 20rpx 20rpx 0'
      },
      // 第2列样式
      2: {
        width: '150rpx',
        height: '150rpx',
        margin: '0 10rpx 10rpx 0'
      },
      // 第3列样式
      3: {
        borderRadius: '50%'  // 只修改圆角
      }
    }"
  />
</template>
```

### 显示删除按钮

```vue
<template>
  <cu-image-preview
    v-model="imageList"
    show-delete
    @delete="handleDelete"
  />
</template>

<script setup>
function handleDelete({ url, index }) {
  //console.log('删除的图片地址:', url);
  //console.log('删除的图片索引:', index);
}
</script>
```

### 自定义删除按钮样式

```vue
<template>
  <!-- 修改单个样式属性 -->
  <cu-image-preview
    v-model="imageList"
    show-delete
    :delete-button-style="{
      borderRadius: '50%'  // 只修改圆角，其他样式保持默认
    }"
  />
  
  <!-- 完全自定义样式 -->
  <cu-image-preview
    v-model="imageList"
    show-delete
    :delete-button-style="{
      width: '40rpx',
      height: '40rpx',
      background: 'rgba(255, 0, 0, 0.6)',
      borderRadius: '50%'
    }"
  />
</template>
```

### 自定义内容

```vue
<template>
  <cu-image-preview v-model="imageList">
    <template #default="{ src, index }">
      <view class="custom-content">
        <text>{{index + 1}}</text>
      </view>
    </template>
  </cu-image-preview>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 图片地址数组或单个图片地址 | Array/String | [] |
| previewStyle | 预览容器样式配置 | Object | `{ width: '220rpx', height: '220rpx', margin: '0 16rpx 16rpx 0', borderRadius: '8rpx' }` |
| previewMode | 图片显示模式 | String | 'aspectFill' |
| showDelete | 是否显示删除按钮 | Boolean | false |
| deleteButtonStyle | 删除按钮样式 | Object | `{ width: '50rpx', height: '50rpx', background: 'rgba(0, 0, 0, 0.5)', borderRadius: '0' }` |
| columnStyles | 列样式配置，key为列索引(从1开始)，value为样式对象 | Object | {} |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 图片列表更新时触发 | urls: Array/String |
| delete | 点击删除按钮时触发 | { url: string, index: number } |
| preview | 点击图片时触发 | { url: string, index: number } |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义内容插槽 | { src: string, index: number } |

### 样式说明

组件的样式配置采用合并策略，优先级为：列样式 > 预览样式 > 默认样式

#### 预览容器默认样式
```js
{
  width: '220rpx',
  height: '220rpx',
  margin: '0 16rpx 16rpx 0',
  borderRadius: '8rpx'
}
```

#### 删除按钮默认样式
```js
{
  width: '50rpx',
  height: '50rpx',
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '0'
}
```

#### 列样式配置示例
```js
{
  // 第1列样式
  1: {
    width: '300rpx',
    height: '300rpx'
  },
  // 第2列样式
  2: {
    borderRadius: '50%'
  }
}
```
