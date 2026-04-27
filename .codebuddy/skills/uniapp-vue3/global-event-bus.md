---
title: UniApp 全局事件总线的正确使用与内存管理
category: uniapp-vue3
tags: [event-bus, global-event, memory-leak, lifecycle]
created: 2026-04-26
---

# UniApp 全局事件总线的正确使用与内存管理

## 问题/场景
在 UniApp 中，跨页面通信（如 A 页面触发，B 页面响应）需要使用全局事件总线。但如果不正确管理事件监听，会导致内存泄漏和重复触发问题。

## 核心要点

### 1. 基本用法

#### 发送事件
```javascript
// 页面 A：触发事件
uni.$emit('eventName', data)
```

#### 监听事件
```javascript
// 页面 B：监听事件
uni.$on('eventName', callback)
```

#### 移除监听
```javascript
// 页面 B：移除监听
uni.$off('eventName', callback)
```

### 2. 标准模式（必须遵循）

```javascript
import { onLoad, onUnload } from '@dcloudio/uni-app'

// 定义回调函数（使用具名函数，便于移除）
const handleEvent = (data) => {
  console.log('收到数据:', data)
  // 处理逻辑
}

onLoad(() => {
  // 注册监听
  uni.$on('eventName', handleEvent)
})

onUnload(() => {
  // 必须移除监听，防止内存泄漏
  uni.$off('eventName', handleEvent)
})
```

### 3. 实际应用场景

#### 场景：头像裁剪完成回调
```javascript
// profile.vue（个人资料页）
import { onLoad, onUnload } from '@dcloudio/uni-app'

const handleAvatarCropper = async (filePath) => {
  // 处理裁剪后的图片
  await uploadAndUpdateAvatar(filePath)
}

onLoad(() => {
  // 监听裁剪完成事件
  uni.$on('uAvatarCropper', handleAvatarCropper)
})

onUnload(() => {
  // 页面卸载时移除监听
  uni.$off('uAvatarCropper', handleAvatarCropper)
})
```

```javascript
// avatarCropper.vue（裁剪页）
const onCropComplete = (croppedFilePath) => {
  // 触发事件，传递裁剪后的图片路径
  uni.$emit('uAvatarCropper', croppedFilePath)
  
  // 返回上一页
  uni.navigateBack()
}
```

### 4. 常见错误与解决方案

#### ❌ 错误 1：使用匿名函数
```javascript
// 错误：无法移除监听
onLoad(() => {
  uni.$on('eventName', (data) => {
    console.log(data)
  })
})

onUnload(() => {
  // 无法移除，因为函数引用不同
  uni.$off('eventName', ???)
})
```

#### ✅ 正确：使用具名函数
```javascript
// 正确：可以精确移除
const handleEvent = (data) => {
  console.log(data)
}

onLoad(() => {
  uni.$on('eventName', handleEvent)
})

onUnload(() => {
  uni.$off('eventName', handleEvent) // 精确移除
})
```

#### ❌ 错误 2：忘记移除监听
```javascript
// 错误：导致内存泄漏和重复触发
onLoad(() => {
  uni.$on('eventName', handleEvent)
})
// 没有 onUnload 清理
```

#### ✅ 正确：成对使用
```javascript
// 正确：注册和移除成对出现
onLoad(() => {
  uni.$on('eventName', handleEvent)
})

onUnload(() => {
  uni.$off('eventName', handleEvent)
})
```

#### ❌ 错误 3：重复注册监听
```javascript
// 错误：每次进入页面都注册，导致多次触发
onShow(() => {
  uni.$on('eventName', handleEvent)
})
```

#### ✅ 正确：只在 onLoad 注册
```javascript
// 正确：只在页面加载时注册一次
onLoad(() => {
  uni.$on('eventName', handleEvent)
})

// onShow 只用于刷新数据，不注册事件
onShow(() => {
  refreshData()
})
```

### 5. 高级用法

#### 一次性监听（once）
```javascript
// 只触发一次，自动移除
uni.$once('oneTimeEvent', (data) => {
  console.log('只执行一次:', data)
})
```

#### 移除所有监听
```javascript
// 移除指定事件的所有监听（慎用）
uni.$off('eventName')

// 移除所有事件的所有监听（极度慎用）
uni.$off()
```

### 6. 完整示例代码

```vue
<script setup>
import { ref } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

const message = ref('')

// 定义事件处理函数
const handleMessageUpdate = (newMessage) => {
  message.value = newMessage
  console.log('收到消息:', newMessage)
}

const handleUserLogin = (userInfo) => {
  console.log('用户登录:', userInfo)
  // 更新页面状态
}

// 页面加载：注册事件监听
onLoad(() => {
  uni.$on('messageUpdate', handleMessageUpdate)
  uni.$on('userLogin', handleUserLogin)
})

// 页面显示：刷新数据
onShow(() => {
  // 不在这里注册事件！
  refreshPageData()
})

// 页面卸载：必须移除事件监听
onUnload(() => {
  uni.$off('messageUpdate', handleMessageUpdate)
  uni.$off('userLogin', handleUserLogin)
})
</script>
```

## 注意事项

1. **必须使用具名函数**：匿名函数无法精确移除，会导致内存泄漏
2. **成对使用**：`$on` 和 `$off` 必须成对出现，在 `onUnload` 中清理
3. **注册时机**：只在 `onLoad` 中注册，不在 `onShow` 中注册
4. **避免重复**：确保事件名唯一，避免与其他页面冲突
5. **数据传递**：事件数据建议用对象包裹，便于扩展

```javascript
// 推荐：使用对象传递数据
uni.$emit('eventName', {
  type: 'update',
  data: { id: 1, name: 'test' },
  timestamp: Date.now()
})
```

## 替代方案

如果项目复杂，建议考虑更优雅的方案：

1. **Pinia Store**：共享状态，响应式更新
2. **provide/inject**：父子组件通信
3. **页面回调**：`navigateBack` 时传递数据

```javascript
// 页面回调方式（无需事件总线）
// 页面 A
const toEditPage = () => {
  toPath('/pages/edit/index')
}

// 页面 B（编辑页）
const onSave = () => {
  const pages = getCurrentPages()
  const prevPage = pages[pages.length - 2]
  // 直接修改上一页数据
  prevPage.$vm.refreshData()
  uni.navigateBack()
}
```

## 相关 Skill

- [页面状态管理](./page-state-management.md)
- [跨页面数据传递](./cross-page-data-transfer.md)
- [头像上传与裁剪](./avatar-upload-crop.md)
