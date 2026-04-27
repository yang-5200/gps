---
title: UniApp 图片预览功能
category: uniapp-vue3
tags: [uniapp, vue3, image, preview, gallery]
created: 2026-04-26
---

# UniApp 图片预览功能

## 问题/场景
需要实现点击缩略图查看大图、多图预览、附件预览等功能。

## 核心要点

### 1. 使用 uni.previewImage API

```js
uni.previewImage({
  urls: images,        // 图片链接列表
  current: images[0]   // 当前显示的图片链接
});
```

### 2. 单图预览

```vue
<script setup>
const previewImage = (url) => {
  if (!url) {
    toast('图片不存在');
    return;
  }
  
  uni.previewImage({
    urls: [url],
    current: url
  });
};
</script>
```

### 3. 多图预览

```vue
<script setup>
const previewImages = (images, currentIndex = 0) => {
  // 如果没有图片，提示用户
  if (!images || images.length === 0) {
    toast('暂无图片');
    return;
  }
  
  // 使用 uni.previewImage 进行多图预览
  uni.previewImage({
    urls: images,
    current: images[currentIndex]
  });
};
</script>
```

### 4. 实际应用示例（合同附件预览）

```vue
<template>
  <view class="contract-item">
    <view class="project-info-row flex justify-between align-center">
      <text class="project-time">日期：{{ item.contract_time }}</text>
      <view class="view-attachment-btn" @click="goAttachment(item)">
        查看附件
      </view>
    </view>
  </view>
</template>

<script setup>
import { toast } from '@/common/utils/util';

const goAttachment = (item) => {
  const images = item.contract_images || [];
  
  // 如果没有图片，提示用户
  if (images.length === 0) {
    toast('暂无附件');
    return;
  }
  
  // 使用 uni.previewImage 进行多图预览
  uni.previewImage({
    urls: images,
    current: images[0]
  });
};
</script>

<style scoped lang="scss">
.view-attachment-btn {
  color: #3D7FFF;
}
</style>
```

### 5. 图片列表点击预览

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

<style scoped lang="scss">
.preview-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}
</style>
```

## API 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `urls` | Array | 是 | 需要预览的图片链接列表 |
| `current` | String | 否 | 当前显示图片的链接，默认为 urls 的第一张 |
| `indicator` | String | 否 | 图片指示器样式，可选 `default`/`number`/`none` |
| `loop` | Boolean | 否 | 是否可循环预览，默认 false |

## 注意事项

1. **空值判断**：预览前必须判断图片数组是否为空
2. **用户体验**：空状态时给用户明确的提示（如 toast）
3. **图片格式**：支持 JPG、PNG、GIF 等常见格式
4. **网络图片**：确保图片链接可访问，注意跨域问题
5. **长图预览**：对于长图，建议使用 `mode="widthFix"`

## 相关 skill

- [图片/图标处理规范](./image-handling.md)
- [工具函数使用规范](./utils.md)
