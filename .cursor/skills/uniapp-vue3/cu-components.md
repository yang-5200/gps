---
title: cu-components 自定义组件使用规范
category: uniapp-vue3
tags: [uniapp, vue3, components, cu-components]
created: 2026-04-27
---

# cu-components 自定义组件使用规范

## 问题/场景
在 uni-app + Vue3 项目中，需要使用项目自定义的 cu-components 组件库，了解各组件的用法、Props 和事件。

## 核心要点

### 1. 引入方式
组件通过 easycom 自动引入，前缀 `cu-`，无需手动 import。

### 2. 组件列表

| 组件 | 用途 | 路径 |
|------|------|------|
| `cu-nav-bar` | 自定义导航栏 | `cu-nav-bar/cu-nav-bar.vue` |
| `cu-popup` | 弹窗 | `cu-popup/cu-popup.vue` |
| `cu-popup-group` | 弹窗组（配合全局弹窗系统使用） | `cu-popup-group/cu-popup-group.vue` |
| `cu-mask` | 遮罩层 | `cu-mask/cu-mask.vue` |
| `cu-layer` | 层级容器 | `cu-layer/cu-layer.vue` |
| `cu-img` | 图片加载 | `cu-img/cu-img.vue` |
| `cu-image-preview` | 图片预览 | `cu-image-preview/cu-image-preview.vue` |
| `cu-media-upload` | 媒体上传 | `cu-media-upload/cu-media-upload.vue` |
| `cu-swiper` | 轮播指示器 | `cu-swiper/cu-swiper.vue` |
| `cu-notice-bar` | 滚动通知 | `cu-notice-bar/cu-notice-bar.vue` |
| `cu-not-data` | 空数据 | `cu-not-data/cu-not-data.vue` |
| `cu-load-more` | 加载更多 | `cu-load-more/cu-load-more.vue` |
| `cu-load-list` | 列表加载 | `cu-load-list/cu-load-list.vue` |
| `cu-scroll-bar` | 滚动条 | `cu-scroll-bar/cu-scroll-bar.vue` |
| `cu-radio` | 单选框 | `cu-radio/cu-radio.vue` |
| `cu-page-footer` | 页脚 | `cu-page-footer/cu-page-footer.vue` |
| `cu-parser` | 富文本解析 | `cu-parser/cu-parser.vue` |
| `cu-save-album` | 保存相册 | `cu-save-album/cu-save-album.vue` |
| `cu-app-update` | APP更新 | `cu-app-update/cu-app-update.vue` |
| `cu-popover` | 气泡弹窗 | `cu-popover/cu-popover.vue` |

## 示例代码

### cu-radio 单选框组件

单选框组件，支持布尔值和数字类型，可用于协议勾选等场景。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `modelValue` | Boolean/Number | false | 绑定的值 |
| `mode` | String | 'df' | 显示模式，可选值：df/1 |
| `is-data-type` | String | 'boo' | 数据类型，可选值：boo/num |
| `active-color` | String | '' | 选中状态的颜色 |
| `inactive-color` | String | '#999' | 未选中状态的颜色 |
| `size` | String | '38rpx' | 图标大小 |

**使用示例:**

```vue
<template>
  <!-- 基础用法 -->
  <view class="protocol-box flex-row align-center">
    <cu-radio v-model="isAgree" is-data-type="boo" active-color="#5D4037" inactive-color="#999" size="32rpx" />
    <text class="text-sm text-gray margin-left-xs">已阅读并同意协议</text>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const isAgree = ref(false);
</script>
```

**完整协议勾选示例:**

```vue
<template>
  <cu-page-footer :isFixed="true" background="transparent">
    <view class="protocol-box padding-tb flex justify-center align-center h100">
      <cu-radio 
        v-model="isAgree" 
        is-data-type="boo" 
        active-color="#5D4037" 
        inactive-color="#999"
        size="26rpx"
        style="margin-top: 5rpx;">
      </cu-radio>
      
      <view class="protocol-text flex align-center justify-center margin-left-xs" @click="toggleAgree">
        <text class="text-gray text-26">已阅读并同意</text>
        <text class="protocol-link text-26" @click.stop="toProtocol('service')">《服务协议》</text>
        <text class="text-gray text-26">和</text>
        <text class="protocol-link text-26" @click.stop="toProtocol('privacy')">《隐私协议》</text>
      </view>
    </view>
  </cu-page-footer>
</template>

<script setup>
import { ref } from 'vue';
import { toPath } from '@/common/utils/util.js';

const isAgree = ref(false);

function toggleAgree() {
  isAgree.value = !isAgree.value;
}

function toProtocol(type) {
  toPath({
    path: '/pages/protocol/index',
    query: { type }
  });
}
</script>
```

### cu-page-footer 页脚组件

用于页面底部固定区域，支持安全区适配和占位处理。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isFixed` | Boolean | false | 是否固定在底部 |
| `placeholder` | Boolean | true | 固定时是否创建占位元素 |
| `safeAreaInsetBottom` | Boolean | true | 是否适配底部安全区 |
| `background` | String | '#FFFFFF' | 背景色 |

**使用示例:**

```vue
<template>
  <view class="page-wrap">
    <view class="page-content">
      <!-- 页面内容 -->
    </view>
    
    <cu-page-footer :isFixed="true" :safeAreaInsetBottom="true" background="transparent">
      <view class="protocol-box flex-row align-center justify-center padding-bottom-lg">
        <!-- 底部内容 -->
      </view>
    </cu-page-footer>
  </view>
</template>
```

### cu-media-upload 媒体上传组件

用于图片上传场景，支持单张/多张图片上传、自定义上传区域、预览样式配置等。

**Props:**

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `v-model` / `modelValue` | String/Array | '' | 绑定的图片值，单张为字符串，多张为数组 |
| `max-count` | Number | 9 | 最大上传数量 |
| `previewStyle` | Object | {} | 预览图片样式配置 |
| `disabled` | Boolean | false | 是否禁用 |
| `readonly` | Boolean | false | 是否只读 |
| `accept` | String | 'image' | 接受文件类型 |
| `capture` | String | '' | 图片选取模式 |
| `compressed` | Boolean | true | 是否压缩 |
| `max-size` | Number | - | 最大文件大小（字节） |
| `upload-url` | String | '' | 上传接口地址 |
| `header` | Object | {} | 上传请求头 |
| `form-data` | Object | {} | 额外表单数据 |
| `name` | String | 'file' | 上传文件字段名 |

**previewStyle 配置项:**

| 属性 | 类型 | 说明 |
|------|------|------|
| `width` | String | 预览图宽度 |
| `height` | String | 预览图高度 |
| `margin` | String | 外边距 |
| `borderRadius` | String | 圆角 |

**Events:**

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| `update:modelValue` | 值更新 | 新的值 |
| `success` | 上传成功 | 响应数据 |
| `error` | 上传失败 | 错误信息 |
| `delete` | 删除图片 | 删除的索引 |

**Slots:**

| 插槽名 | 说明 |
|--------|------|
| `default` | 自定义上传区域内容 |

**使用示例:**

```vue
<template>
  <!-- 单张图片上传（身份证正面） -->
  <cu-media-upload
    v-model="formData.id_card_front_image"
    :max-count="1"
    :previewStyle="{
      width: '670rpx',
      height: '260rpx',
      margin: '0 0 20rpx 0'
    }">
    <view class="input-box w100 flex align-center justify-center box-size-h-130 radius-df bg-input-gray padding-lr-sm padding-tb">
      <image class="box-size-100" src="/static/icon/login/upload-icon-front.png" mode="aspectFit"></image>
    </view>
  </cu-media-upload>

  <!-- 单张图片上传（身份证反面） -->
  <cu-media-upload
    v-model="formData.id_card_back_image"
    :max-count="1"
    :previewStyle="{
      width: '670rpx',
      height: '260rpx',
      margin: '0 0 20rpx 0'
    }">
    <view class="input-box w100 flex align-center justify-center box-size-h-130 radius-df bg-input-gray padding-lr-sm padding-tb">
      <image class="box-size-100" src="/static/icon/login/upload-icon-back.png" mode="aspectFit"></image>
    </view>
  </cu-media-upload>
</template>

<script setup>
import { reactive } from 'vue';

const formData = reactive({
  id_card_front_image: '',  // 单张图片，字符串格式
  id_card_back_image: ''
});
</script>
```

**多张图片上传示例:**

```vue
<template>
  <cu-media-upload
    v-model="formData.images"
    :max-count="9"
    :previewStyle="{
      width: '200rpx',
      height: '200rpx',
      margin: '0 10rpx 10rpx 0'
    }">
    <view class="upload-placeholder flex align-center justify-center">
      <u-icon name="plus" size="40" color="#999"></u-icon>
    </view>
  </cu-media-upload>
</template>

<script setup>
import { reactive } from 'vue';

const formData = reactive({
  images: []  // 多张图片，数组格式
});
</script>
```

## 注意事项/踩坑记录

1. **属性命名规范**: 使用 kebab-case（短横线连接）
   - ✅ `is-data-type="boo"`
   - ✅ `active-color="#5D4037"`
   - ❌ ~~`isDataType="boo"`~~

2. **事件冒泡**: 协议链接需要阻止冒泡
   ```vue
   <text @click.stop="toProtocol('service')">《服务协议》</text>
   ```

3. **easycom 自动引入**: cu-components 组件无需手动 import

4. **cu-media-upload 数据格式**: 
   - 单张图片：`v-model` 绑定字符串（图片URL）
   - 多张图片：`v-model` 绑定数组（图片URL数组）
   - ✅ 单张：`formData.image = ''`
   - ✅ 多张：`formData.images = []`

5. **cu-media-upload previewStyle**: 使用驼峰命名，值需要带单位
   - ✅ `:previewStyle="{ width: '670rpx', height: '260rpx' }"`
   - ❌ ~~`:preview-style="{ width: '670rpx' }"`~~（属性名用驼峰）

## 相关 skill
- [uview-plus 组件使用规范](./uview-plus-components.md)
- [Picker 选择器组件使用规范](./picker-components.md)
- [页面生成规范](./page-generation.md)
- [原子化 CSS 使用规范](./atomic-css.md)
- [全局弹窗系统使用规范](./popup-system.md)
- [表单书写规范](./form.md)
