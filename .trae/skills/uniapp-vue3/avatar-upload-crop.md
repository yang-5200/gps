---
title: UniApp 头像上传与裁剪最佳实践
category: uniapp-vue3
tags: [avatar, upload, crop, image, user-profile, circle-crop]
created: 2025-04-26
updated: 2026-05-04
---

# UniApp 头像上传与裁剪最佳实践

## 问题/场景
用户个人资料页面需要实现头像上传功能，支持从相机拍摄或相册选择，并进行裁剪后上传到服务器。

## 源码参考
- 裁剪页：`pages/avatarCropper/avatarCropper.vue`（Options API 写法，基于 weCropper.js 实现）
- 上传工具：`common/utils/uploadImage.js`（`UploadImg` 类，封装 `uni.uploadFile`）
- 工具函数：`common/utils/util.js`（`toPath`、`handleFilePath`、`toast`、`loading` 等）

## 核心要点

### 1. 功能流程设计
```
点击头像 → 弹出选项（拍摄/相册）→ 选择图片 → 跳转裁剪页 → 裁剪完成 → 上传服务器 → 更新用户信息
```

### 2. 关键代码结构

#### 模板部分
```vue
<template>
  <view class="user-avatar" @click="toEditAvatar">
    <view class="avatar-wrap">
      <!-- 有头像时显示 -->
      <cu-img v-if="userStore.userInfo.avatar" 
        class-name="box-size-69 round"
        :src="handleFilePath(userStore.userInfo.avatar)">
      </cu-img>
      <!-- 无头像时显示占位 -->
      <view v-else class="avatar-placeholder round flex align-center justify-center">
        <text class="cuIcon-cameraadd text-gray text-40"></text>
      </view>
      <!-- 相机角标 -->
      <image class="avatar-camera-icon" src="/static/icon/my/camera.png" mode="aspectFit" />
    </view>
  </view>
</template>
```

#### 选择图片来源
```javascript
const toEditAvatar = async () => {
  try {
    const { tapIndex } = await uni.showActionSheet({
      itemList: ['拍摄', '从相册选择']
    })
    const sourceType = tapIndex === 0 ? 'camera' : 'album'
    await chooseAndCropImage(sourceType)
  } catch (err) {
    // 用户取消 ActionSheet，静默处理
    console.log('操作取消:', err?.errMsg || err)
  }
}
```

#### 选择图片并跳转裁剪
```javascript
const chooseAndCropImage = async (sourceType) => {
  try {
    const { tempFilePaths } = await uni.chooseImage({
      count: 1,
      sourceType: [sourceType]
    })
    
    // 跳转到裁剪页，传递参数
    toPath({
      path: '/pages/avatarCropper/avatarCropper',
      query: {
        destWidth: 300,      // 输出图片宽度(px)
        rectWidth: 200,      // 裁剪框宽度(px)
        fileType: 'jpg',     // 输出格式（jpg 比 png 更小）
        src: tempFilePaths[0] // 原图临时路径
      }
    })
  } catch (err) {
    toast('选择图片失败')
    console.error('选择图片失败:', err)
  }
}
```

#### 处理裁剪完成回调
```javascript
const handleAvatarCropper = async (filePath) => {
  // 防止重复提交
  if (isUploading.value) return
  
  isUploading.value = true
  
  try {
    // 1. 上传图片（UploadImg 内部已自动 showLoading/hideLoading）
    const uploadedUrls = await uploadImage(filePath)
    
    // 2. 更新用户信息
    await updateUserAvatar(uploadedUrls[0])
  } catch (err) {
    // 拦截器已自动 toast，此处仅做降级
    console.error('头像更新失败', err)
  } finally {
    isUploading.value = false
  }
}
```

#### Promise 封装上传类
> **重要**：`UploadImg` 构造函数只支持 `success` 和 `complete` 两个回调，**没有 `fail` 回调**。
> - `success`：每张图片上传成功时调用，参数为已上传成功的 url 数组
> - `complete`：所有图片上传完成时调用（不论成功失败），参数为已上传成功的 url 数组
> - 内部已自动调用 `uni.showLoading()` / `uni.hideLoading()`，外部**不要重复调用**

```javascript
import UploadImg from '@/common/utils/uploadImage.js'

const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    new UploadImg([filePath], {
      success: (urls) => {
        // 每上传成功一张回调一次，可选处理
      },
      complete: (urls) => {
        // 全部完成回调
        if (urls.length > 0) {
          resolve(urls)
        } else {
          reject(new Error('图片上传失败'))
        }
      }
    })
  })
}
```

#### 更新用户头像
```javascript
const updateUserAvatar = async (avatarUrl) => {
  try {
    const res = await http.post(urls.user.profile, { avatar: avatarUrl })
    // code === 1 时才到这里（拦截器已处理非 1 的情况）
    toast(res.msg, 'success')
    // 刷新用户信息
    await userStore.getUserInfo()
  } catch (error) {
    // 拦截器已自动 toast
    console.error('更新头像失败', error)
  }
}
```

### 3. 事件监听与清理
```javascript
import { onLoad, onUnload } from '@dcloudio/uni-app'

onLoad(() => {
  // 监听裁剪完成事件（裁剪页通过 uni.$emit('uAvatarCropper', path) 触发）
  uni.$on('uAvatarCropper', handleAvatarCropper)
})

onUnload(() => {
  // 页面卸载时移除监听，防止内存泄漏
  uni.$off('uAvatarCropper', handleAvatarCropper)
})
```

## 完整示例代码

```vue
<script setup>
import { ref } from 'vue'
import { toPath, handleFilePath, toast } from '@/common/utils/util.js'
import { useUserStore } from '@/stores/user.js'
import { http, urls } from '@/common/api/index.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import UploadImg from '@/common/utils/uploadImage.js'

const userStore = useUserStore()
const isUploading = ref(false)

// ========== 头像更新逻辑 ==========

const toEditAvatar = async () => {
  try {
    const { tapIndex } = await uni.showActionSheet({
      itemList: ['拍摄', '从相册选择']
    })
    const sourceType = tapIndex === 0 ? 'camera' : 'album'
    await chooseAndCropImage(sourceType)
  } catch (err) {
    console.log('操作取消:', err?.errMsg || err)
  }
}

const chooseAndCropImage = async (sourceType) => {
  try {
    const { tempFilePaths } = await uni.chooseImage({
      count: 1,
      sourceType: [sourceType]
    })
    toPath({
      path: '/pages/avatarCropper/avatarCropper',
      query: {
        destWidth: 300,
        rectWidth: 200,
        fileType: 'jpg',
        src: tempFilePaths[0]
      }
    })
  } catch (err) {
    toast('选择图片失败')
    console.error('选择图片失败:', err)
  }
}

const handleAvatarCropper = async (filePath) => {
  if (isUploading.value) return
  isUploading.value = true

  try {
    const uploadedUrls = await uploadImage(filePath)
    await updateUserAvatar(uploadedUrls[0])
  } catch (err) {
    console.error('头像更新失败', err)
  } finally {
    isUploading.value = false
  }
}

const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    new UploadImg([filePath], {
      success: (urls) => {},
      complete: (urls) => {
        if (urls.length > 0) {
          resolve(urls)
        } else {
          reject(new Error('图片上传失败'))
        }
      }
    })
  })
}

const updateUserAvatar = async (avatarUrl) => {
  try {
    const res = await http.post(urls.user.profile, { avatar: avatarUrl })
    toast(res.msg, 'success')
    await userStore.getUserInfo()
  } catch (error) {
    console.error('更新头像失败', error)
  }
}

// ========== 生命周期 ==========

onLoad(() => {
  uni.$on('uAvatarCropper', handleAvatarCropper)
})

onUnload(() => {
  uni.$off('uAvatarCropper', handleAvatarCropper)
})
</script>
```

## 裁剪页说明

裁剪页 `pages/avatarCropper/avatarCropper.vue` 使用 **Options API** 写法（非 `<script setup>`），基于 `weCropper.js` 实现 canvas 裁剪。关键行为：

1. 通过 `onLoad(option)` 接收参数：`destWidth`、`rectWidth`、`fileType`、`src`、`shape`
2. 用户点击"确定"后，通过 `uni.$emit('uAvatarCropper', path)` 发送裁剪结果
3. 调用页面通过 `uni.$on('uAvatarCropper', callback)` 监听该事件
4. 支持 **矩形裁剪** 和 **圆形裁剪** 两种模式，可通过工具栏实时切换
5. 矩形模式下支持多种宽高比：1:1、3:4、4:3、16:9、自由

### 裁剪形状参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `shape` | `string` | `'rect'` | 裁剪形状，`'rect'` 矩形 / `'circle'` 圆形 |

圆形裁剪模式下：
- 强制 1:1 宽高比
- canvas 上显示圆形镂空遮罩效果
- 输出图片为带透明背景的圆形裁剪（建议使用 `png` 格式以保留透明度）
- 宽高比选择器自动隐藏

### 示例：传入圆形裁剪

```javascript
toPath({
  path: '/pages/avatarCropper/avatarCropper',
  query: {
    destWidth: 300,
    rectWidth: 200,
    fileType: 'png',  // 圆形裁剪建议用 png 保留透明背景
    shape: 'circle',   // 默认 'rect'
    src: tempFilePaths[0]
  }
})
```

## 注意事项

1. **防重复提交**：使用 `isUploading` 状态锁防止用户快速点击导致重复上传
2. **错误处理**：用户取消选择时不要弹错误提示，使用静默处理（仅 console.log）
3. **内存管理**：页面卸载时必须 `uni.$off` 移除全局事件监听
4. **状态刷新**：上传成功后调用 `userStore.getUserInfo()` 刷新用户信息
5. **Loading 管理**：`UploadImg` 内部已处理 loading 显示/隐藏，外部不要重复调用 `loading()` 或 `uni.hideLoading()`
6. **上传类名**：导入时使用 `UploadImg`（非 `UploadImage`）

## 相关 Skill

- [接口调用规范](./api-request.md)
- [图片/图标处理规范](./image-handling.md)
- [全局弹窗系统使用规范](./popup-system.md)
- [工具函数使用规范](./utils.md)