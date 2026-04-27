# cu-media-upload 统一媒体上传组件

> 一个组件搞定图片、视频、文件上传！✨ 自动引入，开箱即用。

---

## 🚀 快速开始（30 秒上手）

```vue
<!-- 图片上传 -->
<cu-media-upload type="image" v-model="imageList" />

<!-- 视频上传 -->
<cu-media-upload type="video" v-model="videoList" :maxCount="1" />

<!-- 文件上传 -->
<cu-media-upload type="file" v-model="fileList" :acceptTypes="['.pdf']" />
```

---

## 📖 目录

- [功能特性](#功能特性)
- [基础用法](#基础用法)
- [详细用法](#详细用法)
- [Props 属性](#props-属性)
- [Events 事件](#events-事件)
- [Methods 方法](#methods-方法)
- [数据结构](#数据结构)
- [注意事项](#注意事项)

---

## ✨ 功能特性

- ✅ **三合一设计** - 一个组件支持图片、视频、文件上传
- ✅ **多平台支持** - 微信小程序、H5、APP
- ✅ **智能预览** - 根据媒体类型自动选择最佳预览方式
- ✅ **自动权限** - 自动处理 APP 端权限请求
- ✅ **灵活配置** - 丰富的配置项和插槽支持
- ✅ **自动引入** - 配置 easycom，无需手动 import

---

## 📚 详细用法

### 1. 显示上传时间

```vue
<template>
  <cu-media-upload type="image" v-model="imageList" :showUploadTime="true" />
</template>
```

### 2. 预览模式（只读）

预览模式下不显示上传按钮和删除按钮，适用于展示已有数据：

```vue
<template>
  <cu-media-upload type="image" v-model="imageList" :previewMode="true" />
</template>

<script setup>
import { ref } from 'vue';

const imageList = ref([
  { url: 'https://xxx.com/img1.jpg', uploadedAt: 1234567890000 },
  { url: 'https://xxx.com/img2.jpg', uploadedAt: 1234567890000 },
]);
</script>
```

### 3. 自定义上传按钮

#### 使用插槽自定义

```vue
<template>
  <cu-media-upload type="image" v-model="imageList">
    <view class="custom-upload-btn">
      <image src="/static/upload-icon.png"></image>
      <text>点击上传</text>
    </view>
  </cu-media-upload>
</template>

<style lang="scss">
.custom-upload-btn {
  width: 150rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f8f8;
  border-radius: 8rpx;
}
</style>
```

#### 使用图片作为按钮

```vue
<template>
  <cu-media-upload
    type="image"
    v-model="imageList"
    buttonUrl="/static/upload-button.png"
  />
</template>
```

### 4. 自定义预览样式

```vue
<template>
  <cu-media-upload
    type="image"
    v-model="imageList"
    :mediaWidth="200"
    :mediaHeight="200"
    :previewStyle="{
      borderRadius: '16rpx',
      margin: '0 20rpx 20rpx 0',
    }"
    :deleteButtonStyle="{
      width: '60rpx',
      height: '60rpx',
      background: 'rgba(255, 0, 0, 0.6)',
      borderRadius: '50%',
    }"
  />
</template>
```

### 5. 图片预览模式

```vue
<template>
  <cu-media-upload
    type="image"
    v-model="imageList"
    previewImgMode="aspectFit"
  />
</template>
```

支持的模式：

- `aspectFill` - 缩放填充（默认）
- `aspectFit` - 完整显示
- `scaleToFill` - 拉伸填充
- `widthFix` - 宽度固定
- 等 uni-app image 组件支持的所有模式

### 6. 文件类型过滤

仅在 `type="file"` 时有效：

```vue
<template>
  <!-- 只允许上传 PDF 文件 -->
  <cu-media-upload type="file" v-model="fileList" :acceptTypes="['.pdf']" />

  <!-- 只允许上传 Word 文档 -->
  <cu-media-upload
    type="file"
    v-model="fileList"
    :acceptTypes="['.doc', '.docx']"
  />

  <!-- 只允许上传图片 -->
  <cu-media-upload
    type="file"
    v-model="fileList"
    :acceptTypes="['.jpg', '.png', '.gif']"
  />

  <!-- 允许所有类型 -->
  <cu-media-upload type="file" v-model="fileList" :acceptTypes="['*']" />
</template>
```

### 7. 监听事件

```vue
<template>
  <cu-media-upload
    type="image"
    v-model="imageList"
    @choose="handleChoose"
    @preview="handlePreview"
    @delete="handleDelete"
  />
</template>

<script setup>
const handleChoose = (files) => {
  console.log('选择的文件：', files);
};

const handlePreview = (item) => {
  console.log('预览：', item);
};

const handleDelete = (item) => {
  console.log('删除：', item);
};
</script>
```

### 8. 调用组件方法

```vue
<template>
  <cu-media-upload ref="uploadRef" type="image" v-model="imageList" />
  <button @click="clearAll">清空所有</button>
</template>

<script setup>
import { ref } from 'vue';

const uploadRef = ref(null);
const imageList = ref([]);

const clearAll = () => {
  uploadRef.value.clearMedia();
};
</script>
```

---

## 📋 Props

| 参数                | 类型         | 默认值         | 说明                                          |
| ------------------- | ------------ | -------------- | --------------------------------------------- |
| type                | String       | `'image'`      | 媒体类型：`'image'` \| `'video'` \| `'file'`  |
| modelValue          | Array/String | `[]`           | 双向绑定的媒体列表                            |
| maxCount            | Number       | `9`            | 最大上传数量                                  |
| buttonUrl           | String       | `''`           | 自定义上传按钮图片 URL                        |
| mediaHeight         | Number       | `150`          | 媒体预览高度（rpx）                           |
| mediaWidth          | Number       | `150`          | 媒体预览宽度（rpx）                           |
| previewStyle        | Object       | `{}`           | 预览容器样式配置                              |
| previewImgMode      | String       | `'aspectFill'` | 图片预览模式（仅 `type='image'` 时有效）      |
| deleteButtonStyle   | Object       | 见下方         | 删除按钮样式配置                              |
| showUploadTime      | Boolean      | `false`        | 是否显示上传时间                              |
| acceptTypes         | Array        | `['*']`        | 接受的文件类型（仅 `type='file'` 时有效）     |
| previewMode         | Boolean      | `false`        | 是否为预览模式（不显示上传和删除按钮）        |
| videoSnapshotSuffix | String       | 见下方         | 视频封面 URL 后缀（仅 `type='video'` 时有效） |

### deleteButtonStyle 默认值

```javascript
{
  width: "50rpx",
  height: "50rpx",
  background: "rgba(0, 0, 0, 0.5)",
  borderRadius: "0"
}
```

### videoSnapshotSuffix 默认值

```javascript
'?x-oss-process=video/snapshot,t_300,f_jpg,w_800,h_600,m_fast';
```

根据你的视频服务商调整此参数

---

## 🎪 Events

| 事件名            | 说明               | 回调参数       |
| ----------------- | ------------------ | -------------- |
| update:modelValue | 媒体列表更新时触发 | 新的媒体列表   |
| choose            | 选择媒体时触发     | 选择的媒体文件 |
| preview           | 预览媒体时触发     | 预览的媒体对象 |
| delete            | 删除媒体时触发     | 删除的媒体对象 |

---

## 🎨 Slots

| 插槽名  | 说明           | 作用域参数                           | 适用类型     |
| ------- | -------------- | ------------------------------------ | ------------ |
| default | 自定义上传按钮 | -                                    | 全部         |
| preview | 自定义预览内容 | `{ src }` (图片) / `{ file }` (文件) | image / file |

### 自定义预览插槽示例

#### 图片预览

```vue
<template>
  <cu-media-upload type="image" v-model="imageList">
    <template #preview="{ src }">
      <view class="custom-overlay">
        <text>自定义内容</text>
      </view>
    </template>
  </cu-media-upload>
</template>
```

#### 文件预览

```vue
<template>
  <cu-media-upload type="file" v-model="fileList">
    <template #preview="{ file }">
      <view class="file-info">
        <text>{{ file.name }}</text>
        <text>{{ file.type }}</text>
      </view>
    </template>
  </cu-media-upload>
</template>
```

---

## 🔧 Methods

通过 ref 调用组件方法：

| 方法名     | 说明         | 参数 |
| ---------- | ------------ | ---- |
| clearMedia | 清空所有媒体 | -    |

---

## 📊 数据结构

### 图片和视频

```javascript
[
  {
    url: String, // 媒体URL
    uploadedAt: Number, // 上传时间戳
  },
];
```

### 文件

```javascript
[
  {
    url: String, // 文件URL
    name: String, // 文件名
    type: String, // 文件MIME类型
    uploadedAt: Number, // 上传时间戳
  },
];
```

---

## 🎯 预览功能说明

组件根据媒体类型智能选择预览方式：

### 图片预览

- **所有平台**：使用 `uni.previewImage`
- 支持图片缩放、保存等操作
- 支持查看列表中所有图片

### 视频预览

- 使用自定义 `cu-popup` 视频弹窗
- 支持全屏播放、控制栏等功能

### 文件预览

#### APP 端

- **文档类型**（PDF、Word、Excel、PPT、TXT）：
  - 使用 `openDocument` 打开
  - 自动下载到临时目录
  - 使用系统应用打开
- **其他文件类型**：
  - 使用 `plus.runtime.openURL` 在浏览器打开
  - 浏览器会提示下载

#### H5 端

- 弹出提示框
- 点击"下载"后在新标签页打开文件链接
- 浏览器会根据文件类型自动处理

#### 微信小程序

- 弹出提示框
- 点击"下载"后使用 `uni.downloadFile` 下载
- 文档类型会尝试使用 `uni.openDocument` 打开

---

## ⚠️ 注意事项

### 1. APP 端配置

- **Android**：需要配置存储权限 `WRITE_EXTERNAL_STORAGE`
- **iOS**：自动处理
- 组件会自动请求所需权限

### 2. 文件上传配置

- 使用项目中的 `UploadImage`、`UploadVideo`、`UploadFile` 类
- 需要在 `common/config.js` 中配置上传接口地址
- 确保服务器支持对应的文件类型

### 3. 视频封面配置

- `videoSnapshotSuffix` 参数需要根据你的视频服务商调整
- 示例为阿里云 OSS 的视频截帧参数
- 如果不需要封面，设置为空字符串

### 4. 平台差异

- 不同平台的文件选择器 UI 可能不同
- 微信小程序有文件大小和类型限制
- APP 端可以访问系统文件管理器

---

## 🚀 完整示例

```vue
<template>
  <view class="upload-demo">
    <view class="section">
      <text class="title">图片上传</text>
      <cu-media-upload
        type="image"
        v-model="imageList"
        :maxCount="9"
        :showUploadTime="true"
        @choose="handleChoose"
        @preview="handlePreview"
        @delete="handleDelete"
      />
    </view>

    <view class="section">
      <text class="title">视频上传</text>
      <cu-media-upload
        type="video"
        v-model="videoList"
        :maxCount="1"
        :mediaWidth="200"
        :mediaHeight="150"
      />
    </view>

    <view class="section">
      <text class="title">文件上传（仅PDF）</text>
      <cu-media-upload
        type="file"
        v-model="fileList"
        :maxCount="5"
        :acceptTypes="['.pdf']"
        :showUploadTime="true"
      />
    </view>

    <view class="section">
      <text class="title">自定义上传按钮</text>
      <cu-media-upload type="image" v-model="customImageList">
        <view class="custom-btn">
          <text>自定义按钮</text>
        </view>
      </cu-media-upload>
    </view>

    <view class="section">
      <text class="title">预览模式</text>
      <cu-media-upload
        type="image"
        v-model="previewImageList"
        :previewMode="true"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const imageList = ref([]);
const videoList = ref([]);
const fileList = ref([]);
const customImageList = ref([]);
const previewImageList = ref([
  { url: 'https://via.placeholder.com/300', uploadedAt: Date.now() },
]);

const handleChoose = (files) => {
  console.log('选择的文件：', files);
};

const handlePreview = (item) => {
  console.log('预览：', item);
};

const handleDelete = (item) => {
  console.log('删除：', item);
};
</script>

<style lang="scss">
.upload-demo {
  padding: 20rpx;

  .section {
    margin-bottom: 40rpx;

    .title {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }
  }

  .custom-btn {
    width: 150rpx;
    height: 150rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 28rpx;
  }
}
</style>
```

---

## 💡 常见问题

**Q: 如何限制上传数量？**  
A: 使用 `:maxCount="数量"`

**Q: 如何自定义尺寸？**  
A: 使用 `:mediaWidth="宽度"` 和 `:mediaHeight="高度"`

**Q: 如何限制文件类型？**  
A: 使用 `:acceptTypes="['.pdf', '.doc']"`（仅 `type="file"` 时有效）

**Q: 如何显示上传时间？**  
A: 使用 `:showUploadTime="true"`

**Q: 如何清空已上传的文件？**  
A: 调用 `ref.clearMedia()` 方法

**Q: 如何设置为只读模式？**  
A: 使用 `:previewMode="true"`

---

## 📝 版本

**v1.0.0** - 初始版本

- 合并三个上传组件为统一组件
- 支持图片、视频、文件三种类型
- 智能预览功能
