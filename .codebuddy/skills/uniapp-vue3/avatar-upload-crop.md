---
title: UniApp 头像上传与裁剪最佳实践
category: uniapp-vue3
tags: [avatar, upload, crop, image, user-profile]
created: 2026-04-26
---

# UniApp 头像上传与裁剪最佳实践

## 问题/场景
用户个人资料页面需要实现头像上传功能，支持从相机拍摄或相册选择，并进行裁剪后上传到服务器。

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
    // 用户取消，静默处理
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
        destWidth: 300,      // 输出图片宽度
        rectWidth: 200,      // 裁剪框宽度
        fileType: 'jpg',     // 输出格式
        src: tempFilePaths[0] // 原图路径
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
  loading('上传中...')
  
  try {
    // 1. 上传图片
    const uploadedUrls = await uploadImage(filePath)
    if (!uploadedUrls || uploadedUrls.length === 0) {
      throw new Error('头像上传失败')
    }
    
    // 2. 更新用户信息
    await updateUserAvatar(uploadedUrls[0])
  } catch (err) {
    toast(err.message || '头像更新失败')
  } finally {
    isUploading.value = false
    uni.hideLoading()
  }
}
```

#### Promise 封装上传类
```javascript
const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    new UploadImage([filePath], {
      complete: (urls) => resolve(urls),
      fail: (err) => reject(err)
    })
  })
}
```

#### 更新用户头像
```javascript
const updateUserAvatar = async (avatarUrl) => {
  const res = await http.post(urls.user.profile, {
    avatar: avatarUrl
  })
  
  if (res.code !== 1) {
    throw new Error(res.msg || '更新失败')
  }
  
  toast(res.msg, 'success')
  // 刷新用户信息
  await userStore.getUserInfo()
}
```

### 3. 事件监听与清理
```javascript
import { onLoad, onUnload } from '@dcloudio/uni-app'

onLoad(() => {
  // 监听裁剪完成事件
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
import { toPath, handleFilePath, toast, loading } from '@/common/utils/util.js'
import { useUserStore } from '@/stores/user.js'
import { http, urls } from '@/common/api/index.js'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import UploadImage from '@/common/utils/uploadImage.js'

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
  loading('上传中...')
  
  try {
    const uploadedUrls = await uploadImage(filePath)
    if (!uploadedUrls || uploadedUrls.length === 0) {
      throw new Error('头像上传失败')
    }
    await updateUserAvatar(uploadedUrls[0])
  } catch (err) {
    toast(err.message || '头像更新失败')
  } finally {
    isUploading.value = false
    uni.hideLoading()
  }
}

const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    new UploadImage([filePath], {
      complete: (urls) => resolve(urls),
      fail: (err) => reject(err)
    })
  })
}

const updateUserAvatar = async (avatarUrl) => {
  const res = await http.post(urls.user.profile, { avatar: avatarUrl })
  if (res.code !== 1) {
    throw new Error(res.msg || '更新失败')
  }
  toast(res.msg, 'success')
  await userStore.getUserInfo()
}

onLoad(() => {
  uni.$on('uAvatarCropper', handleAvatarCropper)
})

onUnload(() => {
  uni.$off('uAvatarCropper', handleAvatarCropper)
})
</script>
```

## 注意事项

1. **防重复提交**：使用 `isUploading` 状态锁防止用户快速点击导致重复上传
2. **错误处理**：用户取消选择时不要弹错误提示，使用静默处理
3. **内存管理**：页面卸载时必须移除全局事件监听
4. **状态刷新**：上传成功后刷新用户信息，确保页面显示最新头像
5. **加载反馈**：上传过程中显示 loading，提升用户体验

## 相关 Skill

- [图片/图标处理规范](./image-handling.md)
- [接口调用规范](./api-request.md)
- [全局弹窗系统使用规范](./popup-system.md)
