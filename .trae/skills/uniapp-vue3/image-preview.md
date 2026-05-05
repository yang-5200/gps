---
title: UniApp 图片预览功能
category: uniapp-vue3
tags: [uniapp, vue3, image, preview, gallery, cu-image-preview]
created: 2026-04-26
---

# UniApp 图片预览功能

## 问题/场景
需要实现图片列表展示、点击缩略图查看大图、多图预览、图片删除等功能。

## 核心要点

### 1. 推荐使用 cu-image-preview 组件

项目提供了 `cu-image-preview` 组件，支持图片列表展示、点击预览大图、删除按钮、自定义样式等功能，**推荐优先使用**。

### 2. cu-image-preview 组件用法

#### 基础用法

```vue
<template>
  <!-- 单张图片 -->
  <cu-image-preview v-model="imageUrl" />
  
  <!-- 图片数组 -->
  <cu-image-preview v-model="imageList" />
</template>

<script setup>
import { ref } from 'vue';

const imageUrl = ref('https://example.com/image.jpg');
const imageList = ref([
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
  'https://example.com/image3.jpg'
]);
</script>
```

#### 自定义样式

```vue
<template>
  <!-- 修改预览容器样式 -->
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

#### 带删除按钮

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
  console.log('删除的图片:', url, index);
}
</script>
```

#### 自定义删除按钮样式

```vue
<template>
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

#### 指定列样式（不同列不同尺寸）

```vue
<template>
  <cu-image-preview
    v-model="imageList"
    :column-styles="{
      1: { width: '300rpx', height: '300rpx' },
      2: { borderRadius: '50%' }
    }"
  />
</template>
```

#### 自定义内容插槽

```vue
<template>
  <cu-image-preview v-model="imageList">
    <template #default="{ src, index }">
      <view class="custom-overlay">
        <text>{{ index + 1 }}</text>
      </view>
    </template>
  </cu-image-preview>
</template>
```

### 3. cu-image-preview API

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model` / `modelValue` | Array/String | `[]` | 图片地址数组或单个图片地址 |
| `previewStyle` | Object | `{ width: '220rpx', height: '220rpx', margin: '0 16rpx 16rpx 0', borderRadius: '8rpx' }` | 预览容器样式配置 |
| `previewMode` | String | `'aspectFill'` | 图片显示模式（aspectFill/aspectFit/widthFix 等） |
| `showDelete` | Boolean | `false` | 是否显示删除按钮 |
| `deleteButtonStyle` | Object | `{ width: '50rpx', height: '50rpx', background: 'rgba(0,0,0,0.5)', borderRadius: '0' }` | 删除按钮样式 |
| `columnStyles` | Object | `{}` | 列样式配置，key 为列索引(从1开始)，value 为样式对象 |

#### Events

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 图片列表更新时触发 | urls: Array/String |
| `delete` | 点击删除按钮时触发 | `{ url: string, index: number }` |
| `preview` | 点击图片预览时触发 | `{ url: string, index: number }` |

#### Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| `default` | 自定义内容插槽 | `{ src: string, index: number }` |

### 4. 使用原生 uni.previewImage API

对于不需要图片列表展示的场景（如纯点击预览），可直接使用原生 API：

```js
uni.previewImage({
  urls: images,        // 图片链接列表
  current: images[0]   // 当前显示的图片链接
});
```

#### 原生 API 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `urls` | Array | 是 | 需要预览的图片链接列表 |
| `current` | String | 否 | 当前显示图片的链接，默认为 urls 的第一张 |
| `indicator` | String | 否 | 图片指示器样式，可选 `default`/`number`/`none` |
| `loop` | Boolean | 否 | 是否可循环预览，默认 false |

#### 原生 API 示例

```vue
<template>
  <view class="image-list flex flex-wrap">
    <image 
      v-for="(img, index) in imageList" 
      :key="index"
      :src="img" 
      class="preview-img margin-right-sm margin-bottom-sm"
      mode="aspectFill"
      @click="previewImage(index)"
    ></image>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const imageList = ref([
  'https://example.com/1.jpg',
  'https://example.com/2.jpg',
  'https://example.com/3.jpg'
]);

const previewImage = (index) => {
  uni.previewImage({
    urls: imageList.value,
    current: imageList.value[index]
  });
};
</script>
```

## 选择建议

| 场景 | 推荐方案 |
|------|---------|
| 需要图片列表展示 + 预览 + 删除 | `cu-image-preview` 组件 |
| 需要自定义图片网格样式 | `cu-image-preview` 组件（columnStyles） |
| 纯点击触发预览（无列表展示） | 原生 `uni.previewImage` |
| 附件/文件预览 | 原生 `uni.previewImage` |

## 注意事项

1. **空值判断**：预览前必须判断图片数组是否为空
2. **用户体验**：空状态时给用户明确的提示（如 toast）
3. **图片格式**：支持 JPG、PNG、GIF 等常见格式
4. **网络图片**：确保图片链接可访问
5. **cu-image-preview 使用 handleFilePath**：组件内部会自动处理文件路径转换（`handleFilePath`），无需手动处理

## 相关 skill

- [图片/图标处理规范](./image-handling.md) - 图片占位方案
- [cu-components 自定义组件使用规范](./cu-components.md) - 组件库总览
- [工具函数使用规范](./utils.md) - toast、验证等工具函数
